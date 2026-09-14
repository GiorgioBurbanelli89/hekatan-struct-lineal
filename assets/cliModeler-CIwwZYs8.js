import { i as Xe, t as qe, c as Be, a as _e } from "./cadSections-CAjAf4am.js";
import { c as je } from "./cargasPorCaso-B_GZ_-rO.js";
import { h as Pe, a as Ue, __tla as __tla_0 } from "./h8-CDm7SKnU.js";
import { a as Ye } from "./analyze-DgLgRmKg.js";
import { m as Ge, d as Ze, __tla as __tla_1 } from "./didacticCpp-DH-WISVI.js";
let is, Ve;
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
  function Je(l) {
    const t = l.toLowerCase().trim();
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
    ], c = t.split(/[\s,]+/).filter(Boolean);
    if (c.length > 1 && c.length <= 6 && c.every((S) => S === "0" || S === "1")) return c.forEach((S, X) => {
      D[X] = S === "1";
    }), D;
    for (const S of c) De[S] !== void 0 && (D[De[S]] = true);
    if (/^[01]+$/.test(t) && t.length <= 6) for (let S = 0; S < t.length; S++) D[S] = t[S] === "1";
    return D;
  }
  Ve = function(l) {
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
      frameISec: /* @__PURE__ */ new Map(),
      frameTube: /* @__PURE__ */ new Map(),
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
    let D = null, c = 0, S = 0, X = 0;
    const $ = l.split(/\r?\n/);
    for (let q = 0; q < $.length; q++) {
      let I = $[q].trim();
      if (!I || I.startsWith("#") || I.startsWith("//")) continue;
      I = I.replace(/[;]+$/, "");
      const o = I.split(/\s+/), E = o[0].toLowerCase();
      if (E === "nodes" && o.length === 1) {
        D = "nodes";
        continue;
      }
      if ((E === "elements" || E === "frames") && o.length === 1) {
        D = "elements";
        continue;
      }
      if (E === "areas" && o.length === 1) {
        D = "areas";
        continue;
      }
      if (E === "supports" && o.length === 1) {
        D = "supports";
        continue;
      }
      if (E === "loads" && o.length === 1) {
        D = "loads";
        continue;
      }
      if (E === "springs" && o.length === 1) {
        D = "springs";
        continue;
      }
      if (D && /^[\-\d]/.test(o[0])) {
        const e = o.map(parseFloat);
        if (D === "nodes" && e.length >= 3) {
          c++, t.nodes.set(c, [
            e[0],
            e[1],
            e[2]
          ]);
          continue;
        }
        if (D === "elements" && e.length >= 2) {
          S++, t.frames.push({
            id: S,
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
        const e = parseInt(o[0], 10), n = o.slice(1).join(" ");
        t.supports.set(e, Je(n));
        continue;
      }
      D && !/^[\-\d]/.test(o[0]) && (D = null);
      try {
        switch (E) {
          case "node":
          case "n": {
            const e = parseInt(o[1], 10), n = parseFloat(o[2]), a = parseFloat(o[3]), r = parseFloat(o[4]);
            !isFinite(e) || !isFinite(n) || !isFinite(a) || !isFinite(r) ? t.errors.push(`L${q + 1}: node mal formado: ${I}`) : t.nodes.set(e, [
              n,
              a,
              r
            ]);
            break;
          }
          case "frame":
          case "beam":
          case "column":
          case "f": {
            const e = parseInt(o[1], 10), n = parseInt(o[2], 10), a = parseInt(o[3], 10), r = parseFloat(o[4] ?? "25e6"), f = parseFloat(o[5] ?? "0.16"), k = parseFloat(o[6] ?? "0.001"), v = o[7] !== void 0 ? parseFloat(o[7]) : void 0, u = o[8] !== void 0 ? parseFloat(o[8]) : void 0, C = o[9] !== void 0 ? parseFloat(o[9]) : void 0, b = o[10] !== void 0 ? parseFloat(o[10]) : void 0, T = o[11] !== void 0 ? parseFloat(o[11]) : void 0, W = o[12] !== void 0 ? parseFloat(o[12]) : void 0, Y = o.indexOf("#"), O = Y >= 0 && o[Y + 1] ? o[Y + 1] : void 0;
            t.frames.push({
              id: e,
              nI: n,
              nJ: a,
              E: r,
              A: f,
              I: k,
              Iy: v,
              J: u,
              nu: C,
              rho: b,
              D: T,
              B: W,
              sec: O
            });
            break;
          }
          case "cftc": {
            const e = parseInt(o[1], 10), n = parseFloat(o[2] ?? ""), a = parseFloat(o[3] ?? ""), r = parseFloat(o[4] ?? "25e6"), f = parseFloat(o[5] ?? "0.2"), k = parseFloat(o[6] ?? "2.4");
            isFinite(e) && n > 0 && a > 0 && a < n / 2 && r > 0 ? t.frameCftc.set(e, {
              D: n,
              t: a,
              Ec: r,
              nuC: isFinite(f) ? f : 0.2,
              rhoC: isFinite(k) && k >= 0 ? k : 2.4
            }) : t.errors.push(`cftc ${o[1]}: hace falta D t (m) y Ec (kN/m2), con t < D/2`);
            break;
          }
          case "isec":
          case "perfili": {
            const e = parseInt(o[1], 10), n = o.slice(2, 8).map((C) => parseFloat(C)), [a, r, f, k] = n, v = isFinite(n[4]) ? n[4] : r, u = isFinite(n[5]) ? n[5] : f;
            isFinite(e) && a > 0 && r > 0 && f > 0 && k > 0 && v > 0 && u > 0 && f + u < a && k < Math.min(r, v) ? t.frameISec.set(e, {
              d: a,
              bf: r,
              tf: f,
              tw: k,
              t2b: v,
              tfb: u
            }) : t.errors.push(`isec ${o[1]}: hace falta d bf tf tw [t2b tfb] (m), con tf+tfb < d y tw < bf`);
            break;
          }
          case "tubo":
          case "tube": {
            const e = parseInt(o[1], 10), [n, a, r, f] = o.slice(2, 6).map((k) => parseFloat(k));
            isFinite(e) && n > 0 && a > 0 && r > 0 && f > 0 && f < n / 2 && r < a / 2 ? t.frameTube.set(e, {
              b: n,
              h: a,
              tf: r,
              tw: f
            }) : t.errors.push(`tubo ${o[1]}: hace falta b h tf tw (m), con tw < b/2 y tf < h/2`);
            break;
          }
          case "cft": {
            const e = parseInt(o[1], 10), n = o.slice(2).map((W) => parseFloat(W)), a = n.length >= 5 && n[3] < 1 && n[4] >= 1, r = n[0], f = n[1], k = n[2], v = a ? n[3] : n[2], u = a ? 4 : 3, C = isFinite(n[u]) ? n[u] : 25e6, b = isFinite(n[u + 1]) ? n[u + 1] : 0.2, T = isFinite(n[u + 2]) ? n[u + 2] : 2.4;
            isFinite(e) && r > 0 && f > 0 && k > 0 && v > 0 && v < r / 2 && k < f / 2 && C > 0 ? t.frameCft.set(e, {
              b: r,
              h: f,
              t: k,
              tw: v,
              Ec: C,
              nuC: b,
              rhoC: T >= 0 ? T : 2.4
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
            const e = parseInt(o[1], 10), n = o.slice(2).map((r) => r.toLowerCase());
            if (!isFinite(e) || n.length === 0) {
              t.errors.push('release: se esperaba "release frameID <12 bits> | pin fix"');
              break;
            }
            const a = new Array(12).fill(false);
            if (n.length === 2 && n.every((r) => /^(pin|fix|libre|rigido)$/.test(r))) n.forEach((r, f) => {
              (r === "pin" || r === "libre") && (a[f * 6 + 4] = true, a[f * 6 + 5] = true);
            });
            else {
              const r = n.filter((f) => f === "0" || f === "1");
              if (r.length !== 12) {
                t.errors.push(`release ${e}: hacen falta 12 banderas (U1 U2 U3 R1 R2 R3 en I y en J), llegaron ${r.length}`);
                break;
              }
              for (let f = 0; f < 12; f++) a[f] = r[f] === "1";
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
            const e = parseInt(o[1], 10), n = parseFloat(o[2] ?? "0"), a = o.slice(3).some((r) => /^(nodal|lumped|sap|etabs)$/i.test(r));
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
            const e = parseInt(o[1], 10), n = parseFloat(o[2] ?? "0"), a = parseFloat(o[3] ?? "0"), r = parseFloat(o[4] ?? "0");
            if (!isFinite(e) || !isFinite(n) || !isFinite(a)) {
              t.errors.push('endoffset: se esperaba "endoffset frameID offI offJ [rz]"');
              break;
            }
            t.frameEndOffsets.set(e, [
              n,
              a,
              isFinite(r) ? r : 0
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
            ], a = parseFloat(o[6] ?? "0.20"), r = parseFloat(o[7] ?? "25e6"), f = o[9] !== void 0 ? parseFloat(o[9]) : void 0, k = f !== void 0 && isFinite(f) ? f : void 0;
            if (t.shells.push({
              id: e,
              pts: n,
              t: a,
              E: r,
              rho: k
            }), o[8] !== void 0) {
              const v = parseFloat(o[8]);
              isFinite(v) && v !== 0 && t.shellLoads.set(e, v);
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
              const a = n[0], r = n[1];
              t.shellMods.set(e, [
                isFinite(a) ? a : 1,
                isFinite(r) ? r : 1
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
            const [n, a, r, f, k, v, u] = e, C = [];
            for (let b = v; b <= u; b++) C.push(b);
            t.areaObjs.push({
              id: n,
              pts: [
                a,
                r,
                f,
                k
              ],
              cells: C
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
            const e = parseInt(o[1], 10), n = parseFloat(o[2] ?? "0"), a = parseFloat(o[3] ?? "0"), r = parseFloat(o[4] ?? "0"), f = parseFloat(o[5] ?? "0"), k = parseFloat(o[6] ?? "0"), v = parseFloat(o[7] ?? "0"), u = o[8] && isNaN(parseFloat(o[8])) ? o[8] : "Dead";
            /^dead$/i.test(u) ? t.loads.set(e, [
              n,
              a,
              r,
              f,
              k,
              v
            ]) : (t.loadsPat.has(u) || t.loadsPat.set(u, /* @__PURE__ */ new Map()), t.loadsPat.get(u).set(e, [
              n,
              a,
              r,
              f,
              k,
              v
            ]));
            break;
          }
          case "frameload":
          case "fl": {
            const e = parseInt(o[1], 10), n = parseFloat(o[2] ?? "0"), a = parseFloat(o[3] ?? "0"), r = parseFloat(o[4] ?? "0"), f = o[5] && isNaN(parseFloat(o[5])) ? o[5] : "Dead", k = /^dead$/i.test(f) ? t.frameLoads : t.frameLoadsPat.get(f) ?? (t.frameLoadsPat.set(f, /* @__PURE__ */ new Map()), t.frameLoadsPat.get(f)), v = k.get(e) ?? [
              0,
              0,
              0
            ];
            k.set(e, [
              v[0] + n,
              v[1] + a,
              v[2] + r
            ]);
            break;
          }
          case "spring": {
            const e = parseInt(o[1], 10), n = (o[2] ?? "uz").toLowerCase(), a = De[n] ?? 2, r = parseFloat(o[3] ?? "1000");
            t.springs.push({
              node: e,
              dof: a,
              k: r
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
            t.errors.push(`L${q + 1}: comando desconocido "${E}"`);
        }
      } catch (e) {
        t.errors.push(`L${q + 1}: error "${I}" \u2014 ${e.message}`);
      }
    }
    return t;
  };
  const He = `# CLI Modeler \u2014 escrib\xED comandos para construir un modelo
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
`, P = (l, t) => [
    l[0] - t[0],
    l[1] - t[1],
    l[2] - t[2]
  ], de = (l, t) => l[0] * t[0] + l[1] * t[1] + l[2] * t[2], we = (l, t) => [
    l[1] * t[2] - l[2] * t[1],
    l[2] * t[0] - l[0] * t[2],
    l[0] * t[1] - l[1] * t[0]
  ], Z = (l) => Math.hypot(l[0], l[1], l[2]), ae = (l, t) => [
    l[0] * t,
    l[1] * t,
    l[2] * t
  ];
  function Re(l, t) {
    const D = l.shellModsDir.get(t);
    return !!D && Math.abs(D[3]) < 1e-12 && Math.abs(D[4]) < 1e-12 && Math.abs(D[5]) < 1e-12;
  }
  function Ke(l, t = 200, D) {
    const c = [
      0,
      1,
      2
    ].map((u) => (l[0][u] + l[1][u] + l[2][u] + l[3][u]) / 4);
    let S = P(l[1], l[0]), X = we(S, P(l[3], l[0]));
    X = ae(X, 1 / Z(X)), S = ae(S, 1 / Z(S));
    const $ = we(X, S), q = l.map((u) => [
      de(P(u, c), S),
      de(P(u, c), $)
    ]);
    let I = [
      0,
      1,
      2,
      3
    ];
    if (D) {
      const u = [
        0,
        1,
        2,
        3
      ].map((C) => {
        const b = P(l[(C + 1) % 4], l[C]);
        return Math.abs(de(b, D)) / Z(b);
      });
      I = [
        0,
        1,
        2,
        3
      ].sort((C, b) => u[C] - u[b]).slice(0, 2);
    }
    const o = q.map((u) => u[0]), E = q.map((u) => u[1]), e = Math.min(...o), n = Math.max(...o), a = Math.min(...E), r = Math.max(...E), f = [
      0,
      1,
      2,
      3
    ].map(() => ({
      pts: [],
      dA: 0
    }));
    let k = 0;
    for (let u = 0; u < t; u++) for (let C = 0; C < t; C++) {
      const b = e + (n - e) * (u + 0.5) / t, T = a + (r - a) * (C + 0.5) / t;
      let W = 0, Y = 0;
      for (let B = 0; B < 4; B++) {
        const _ = q[B], H = q[(B + 1) % 4];
        (H[0] - _[0]) * (T - _[1]) - (H[1] - _[1]) * (b - _[0]) >= 0 ? W++ : Y++;
      }
      if (W !== 4 && Y !== 4) continue;
      let O = I[0], J = 1 / 0;
      for (const B of I) {
        const _ = q[B], H = q[(B + 1) % 4], se = H[0] - _[0], N = H[1] - _[1], fe = se * se + N * N, re = Math.max(0, Math.min(1, ((b - _[0]) * se + (T - _[1]) * N) / fe)), K = Math.hypot(b - (_[0] + re * se), T - (_[1] + re * N));
        K < J && (J = K, O = B);
      }
      f[O].pts.push([
        c[0] + b * S[0] + T * $[0],
        c[1] + b * S[1] + T * $[1],
        c[2] + b * S[2] + T * $[2]
      ]), k++;
    }
    const v = 0.5 * Z(we(P(l[2], l[0]), P(l[3], l[1])));
    for (const u of f) u.dA = k ? v / k : 0;
    return f;
  }
  function Qe(l, t) {
    if (!(t > 0)) return;
    const D = 1e-6, c = (E) => l.nodes.get(E);
    let S = Math.max(0, ...l.nodes.keys()) + 1, X = l.shells.reduce((E, e) => Math.max(E, e.id), 0) + 1;
    const $ = (E) => {
      for (const [n, a] of l.nodes) if (Z(P(a, E)) < D) return n;
      const e = S++;
      return l.nodes.set(e, [
        E[0],
        E[1],
        E[2]
      ]), e;
    }, q = (E, e) => {
      const n = l.shellModsDir.get(E);
      n && l.shellModsDir.set(e, [
        ...n
      ]);
      const a = l.shellMods.get(E);
      a && l.shellMods.set(e, [
        ...a
      ]);
      const r = l.shellLoads.get(E);
      r !== void 0 && l.shellLoads.set(e, r);
      const f = l.shellTypes.get(E);
      f !== void 0 && l.shellTypes.set(e, f);
      const k = l.shellAngles.get(E);
      k !== void 0 && l.shellAngles.set(e, k);
    }, I = [];
    let o = 0;
    for (const E of l.shells) {
      if (E.pts.length !== 4) {
        I.push(E);
        continue;
      }
      const e = E.pts.map(c);
      if (e.some((u) => !u)) {
        I.push(E);
        continue;
      }
      const n = (Z(P(e[1], e[0])) + Z(P(e[2], e[3]))) / 2, a = (Z(P(e[3], e[0])) + Z(P(e[2], e[1]))) / 2, r = Math.max(1, Math.ceil(n / t - 1e-9)), f = Math.max(1, Math.ceil(a / t - 1e-9));
      if (r === 1 && f === 1) {
        I.push(E);
        continue;
      }
      const k = (u, C) => [
        0,
        1,
        2
      ].map((b) => e[0][b] * (1 - u) * (1 - C) + e[1][b] * u * (1 - C) + e[2][b] * u * C + e[3][b] * (1 - u) * C), v = [];
      for (let u = 0; u <= r; u++) {
        const C = [];
        for (let b = 0; b <= f; b++) C.push($(k(u / r, b / f)));
        v.push(C);
      }
      for (let u = 0; u < r; u++) for (let C = 0; C < f; C++) {
        const b = u === 0 && C === 0 ? E.id : X++;
        I.push({
          ...E,
          id: b,
          pts: [
            v[u][C],
            v[u + 1][C],
            v[u + 1][C + 1],
            v[u][C + 1]
          ]
        }), b !== E.id && q(E.id, b);
      }
      o++;
    }
    o && (l.shells = I, console.log(`[CLI Modeler] automesh ${t} m: ${o} pano(s) partido(s) -> ${l.shells.length} cascaras, ${l.nodes.size} nudos`));
  }
  function es(l) {
    const D = (a) => l.nodes.get(a), c = [
      ...l.nodes.keys()
    ], S = (a, r, f) => {
      const k = P(r, a), v = Z(k), u = ae(k, 1 / v), C = [];
      for (const b of c) {
        if (f.includes(b)) continue;
        const T = P(D(b), a), W = de(T, u);
        W > 1e-6 && W < v - 1e-6 && Z(P(T, ae(u, W))) < 1e-4 && C.push(W / v);
      }
      return C.sort((b, T) => b - T);
    }, X = (a, r) => {
      const f = [];
      for (const k of a) r.some((v) => Math.abs(k - v) < 1e-5) && !f.some((v) => Math.abs(k - v) < 1e-5) && f.push(k);
      return f;
    }, $ = (a) => {
      for (const r of c) if (Z(P(D(r), a)) < 1e-4) return r;
    };
    let q = l.shells.reduce((a, r) => Math.max(a, r.id), 0) + 1;
    const I = [], o = (a, r) => {
      const f = l.shellModsDir.get(a);
      f && l.shellModsDir.set(r, [
        ...f
      ]);
      const k = l.shellMods.get(a);
      k && l.shellMods.set(r, [
        ...k
      ]);
      const v = l.shellLoads.get(a);
      v !== void 0 && l.shellLoads.set(r, v);
      const u = l.shellTypes.get(a);
      u !== void 0 && l.shellTypes.set(r, u);
      const C = l.shellAngles.get(a);
      C !== void 0 && l.shellAngles.set(r, C);
    };
    for (const a of l.shells) {
      if (!Re(l, a.id) || a.pts.length !== 4 || a.pts.some((O) => !l.nodes.has(O))) {
        I.push(a);
        continue;
      }
      const r = a.pts.map(D), f = S(r[0], r[1], a.pts), k = S(r[2], r[3], a.pts).map((O) => 1 - O), v = S(r[1], r[2], a.pts), u = S(r[3], r[0], a.pts).map((O) => 1 - O);
      let C = [
        0,
        ...X(f, k),
        1
      ], b = [
        0,
        ...X(v, u),
        1
      ];
      if (C.length === 2 && b.length === 2) {
        I.push(a);
        continue;
      }
      const T = (O, J) => [
        0,
        1,
        2
      ].map((B) => (1 - O) * (1 - J) * r[0][B] + O * (1 - J) * r[1][B] + O * J * r[2][B] + (1 - O) * J * r[3][B]);
      let W = b.map((O) => C.map((J) => $(T(J, O))));
      if (W.some((O) => O.some((J) => J === void 0)) && (C.length >= b.length ? b = [
        0,
        1
      ] : C = [
        0,
        1
      ], W = b.map((O) => C.map((J) => $(T(J, O)))), W.some((O) => O.some((J) => J === void 0)))) {
        I.push(a);
        continue;
      }
      let Y = true;
      for (let O = 0; O < b.length - 1; O++) for (let J = 0; J < C.length - 1; J++) {
        const B = [
          W[O][J],
          W[O][J + 1],
          W[O + 1][J + 1],
          W[O + 1][J]
        ], _ = Y ? a.id : q++;
        Y || o(a.id, _), Y = false, I.push({
          id: _,
          pts: B,
          t: a.t,
          E: a.E,
          rho: a.rho
        });
      }
    }
    l.shells = I;
    const E = 9.80665, e = (a, r) => {
      const f = l.loads.get(a) ?? [
        0,
        0,
        0,
        0,
        0,
        0
      ];
      l.loads.set(a, [
        f[0] + r[0],
        f[1] + r[1],
        f[2] + r[2],
        f[3] + r[3],
        f[4] + r[4],
        f[5] + r[5]
      ]);
    }, n = (a, r) => {
      const f = P(r, a), k = Z(f), v = ae(f, 1 / k);
      return l.frames.filter((u) => [
        u.nI,
        u.nJ
      ].every((C) => {
        const b = l.nodes.get(C);
        if (!b) return false;
        const T = P(b, a), W = de(T, v);
        return W > -1e-4 && W < k + 1e-4 && Z(P(T, ae(v, W))) < 1e-4;
      }));
    };
    for (const a of l.shells) {
      if (!Re(l, a.id) || a.pts.length !== 4) continue;
      const r = l.selfWeight ? (a.rho ?? 2.45) * a.t * E * l.selfWeight : 0, f = l.shellLoads.get(a.id) ?? 0, k = -r + f;
      if (Math.abs(k) < 1e-15) continue;
      const v = a.pts.map(D);
      let u;
      if (l.deckOneWay) {
        const b = P(v[1], v[0]);
        let T = we(b, P(v[3], v[0]));
        T = ae(T, 1 / Z(T));
        const W = ae(b, 1 / Z(b)), Y = we(T, W), O = (l.shellAngles.get(a.id) ?? 0) * Math.PI / 180;
        u = [
          0,
          1,
          2
        ].map((J) => Math.cos(O) * W[J] + Math.sin(O) * Y[J]);
      }
      const C = Ke(v, 200, u);
      for (let b = 0; b < 4; b++) {
        const { pts: T, dA: W } = C[b];
        if (!T.length) continue;
        const Y = v[b], O = v[(b + 1) % 4], J = n(Y, O);
        if (!J.length) {
          const N = k * W * T.length;
          e(a.pts[b], [
            0,
            0,
            N / 2,
            0,
            0,
            0
          ]), e(a.pts[(b + 1) % 4], [
            0,
            0,
            N / 2,
            0,
            0,
            0
          ]);
          continue;
        }
        const B = P(O, Y), _ = Z(B), H = ae(B, 1 / _), se = T.map((N) => de(P(N, Y), H));
        for (const N of J) {
          const fe = D(N.nI), re = D(N.nJ), K = de(P(fe, Y), H), be = de(P(re, Y), H), pe = Math.min(K, be), Q = Math.max(K, be), ce = Q - pe;
          if (ce < 1e-9) continue;
          const te = Q >= _ - 1e-6, ne = ae(P(re, fe), 1 / ce), oe = we(ne, [
            0,
            0,
            1
          ]);
          let he = 0, ue = 0, Fe = 0, me = 0;
          for (const ge of se) {
            if (ge < pe - 1e-9 || (te ? ge > Q + 1e-9 : ge >= Q - 1e-9)) continue;
            let le = ge - pe;
            K > be && (le = ce - le);
            const s = le / ce;
            he += 1 - 3 * s * s + 2 * s * s * s, ue += ce * (s - 2 * s * s + s * s * s), Fe += 3 * s * s - 2 * s * s * s, me += ce * (-s * s + s * s * s);
          }
          const ee = k * W;
          e(N.nI, [
            0,
            0,
            ee * he,
            oe[0] * ee * ue,
            oe[1] * ee * ue,
            oe[2] * ee * ue
          ]), e(N.nJ, [
            0,
            0,
            ee * Fe,
            oe[0] * ee * me,
            oe[1] * ee * me,
            oe[2] * ee * me
          ]);
        }
      }
      l.deckTributario.add(a.id), l.shellLoads.delete(a.id);
    }
  }
  is = {
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
    runModal(l, t, D) {
      var _a;
      const c = t.nodes.val, S = t.elements.val;
      if (!(!c.length || !S.length)) try {
        const X = Math.max(1, parseInt(window.__hekatanCliModalModes ?? "12", 10) || 12), $ = t.nodeInputs.val, q = window.__hekatanCliSprings, I = Ge(c, S, $, t.elementInputs.val, X, 0, 0, 1, ($ == null ? void 0 : $.diaphragms) instanceof Map && $.diaphragms.size ? $.diaphragms : void 0, q && q.length ? q : void 0);
        console.log(`[CLI Modeler] Modal OK \u2014 ${I.frequencies.length} modos, T1 = ${I.frequencies[0] ? (1 / I.frequencies[0]).toFixed(5) : "\u2014"} s`), (_a = D == null ? void 0 : D.render) == null ? void 0 : _a.call(D, I, {
          title: "Modal del .heks (masa 3D, como SAP2000)"
        });
      } catch (X) {
        console.error("[CLI Modeler] modal:", (X == null ? void 0 : X.message) ?? X);
      }
    },
    build(l, t) {
      var _a, _b;
      const D = window.__hekatanCliScript ?? He;
      window.__hekatanCliLastScript = D;
      const c = Ve(D);
      c.autoMesh > 0 && Qe(c, c.autoMesh), c.deckEtabs && es(c);
      const S = /* @__PURE__ */ new Map(), X = /* @__PURE__ */ new Map(), $ = [], q = Array.from(c.nodes.keys()).sort((s, d) => s - d);
      for (const s of q) S.set(s, $.length), $.push(c.nodes.get(s));
      const I = [], o = /* @__PURE__ */ new Map(), E = /* @__PURE__ */ new Map(), e = /* @__PURE__ */ new Map(), n = /* @__PURE__ */ new Map(), a = /* @__PURE__ */ new Map(), r = /* @__PURE__ */ new Map(), f = /* @__PURE__ */ new Map(), k = /* @__PURE__ */ new Map(), v = /* @__PURE__ */ new Map(), u = /* @__PURE__ */ new Map(), C = /* @__PURE__ */ new Map(), b = /* @__PURE__ */ new Map(), T = /* @__PURE__ */ new Map(), W = /* @__PURE__ */ new Map(), Y = /* @__PURE__ */ new Map(), O = /* @__PURE__ */ new Map(), J = /* @__PURE__ */ new Map(), B = /* @__PURE__ */ new Map(), _ = /* @__PURE__ */ new Map(), H = /* @__PURE__ */ new Map();
      for (const s of c.frames) {
        const d = S.get(s.nI), w = S.get(s.nJ);
        if (d === void 0 || w === void 0) {
          const m = q.length ? `IDs disponibles: ${q.join(", ")}` : "ning\xFAn nodo definido", j = [];
          d === void 0 && j.push(s.nI), w === void 0 && j.push(s.nJ), c.errors.push(`frame ${s.id}: nodo(s) inexistente(s) [${j.join(", ")}] \u2014 ${m}`);
          continue;
        }
        const i = I.length;
        I.push([
          d,
          w
        ]);
        const p = s.nu ?? 0.2;
        o.set(i, s.E), E.set(i, s.E / (2 * (1 + p))), e.set(i, s.A), n.set(i, s.I), a.set(i, s.Iy ?? s.I), r.set(i, s.J ?? 0.14 * Math.pow(Math.sqrt(s.A), 4)), f.set(i, s.rho ?? 2.45), _.set(i, p), s.D !== void 0 && isFinite(s.D) && k.set(i, s.D), s.B !== void 0 && isFinite(s.B) && v.set(i, s.B);
        const g = c.frameAngles.get(s.id);
        g !== void 0 && isFinite(g) && C.set(i, g);
        const M = c.frameReleases.get(s.id);
        M && b.set(i, M);
        const h = c.frameEndOffsets.get(s.id);
        h && T.set(i, h);
        const A = c.frameLoads.get(s.id);
        A && O.set(i, A);
        const z = c.frameShearAreas.get(s.id);
        if (z && (B.set(i, z[0]), J.set(i, z[1])), s.sec || s.D !== void 0 && s.B !== void 0) {
          const m = {
            type: "general"
          };
          s.sec && (m.name = s.sec), s.D !== void 0 && isFinite(s.D) && (m.h = s.D), s.B !== void 0 && isFinite(s.B) && (m.b = s.B), u.set(i, m);
        }
        const F = c.frameISec.get(s.id);
        if (F) {
          const m = Xe(F.d, F.bf, F.tf, F.tw, F.t2b, F.tfb);
          e.set(i, m.A), a.set(i, m.Iz), n.set(i, m.Iy), r.set(i, m.J), B.set(i, m.As2), J.set(i, m.As3), k.set(i, F.d), v.set(i, Math.max(F.bf, F.t2b));
          const j = (R) => Math.round(R * 1e4) / 10;
          u.set(i, {
            type: "I",
            h: F.d,
            b: F.bf,
            tf: F.tf,
            tw: F.tw,
            t2b: F.t2b,
            tfb: F.tfb,
            name: s.sec ?? `I${j(F.d)}X${j(F.bf)}X${j(F.tf)}X${j(F.tw)}`
          });
        }
        const x = c.frameTube.get(s.id);
        if (x) {
          const m = qe(x.b, x.h, x.tf, x.tw);
          e.set(i, m.A), a.set(i, m.Iz), n.set(i, m.Iy), r.set(i, m.J), B.set(i, m.As2), J.set(i, m.As3), k.set(i, x.h), v.set(i, x.b);
          const j = (R) => Math.round(R * 1e4) / 10;
          u.set(i, {
            type: "HSS",
            h: x.h,
            b: x.b,
            tf: x.tf,
            tw: x.tw,
            name: s.sec ?? `TUBO${j(x.h)}X${j(x.b)}X${j(x.tf)}X${j(x.tw)}`
          });
        }
        const y = c.frameCftc.get(s.id);
        if (y) {
          const m = Be(y.D, y.t, s.E, p, y.Ec, y.nuC);
          e.set(i, m.A), a.set(i, m.Iz), n.set(i, m.Iy), r.set(i, m.J), B.set(i, m.As2), J.set(i, m.As3), k.set(i, y.D), v.set(i, y.D);
          const j = y.D - 2 * y.t, R = Math.PI * j * j / 4, U = Math.PI * y.D * y.D / 4 - R;
          f.set(i, ((s.rho ?? 7.85) * U + y.rhoC * R) / m.A), u.set(i, {
            type: "CFT",
            d: y.D,
            tw: y.t,
            fillE: y.Ec,
            fillRho: y.rhoC,
            steelRho: s.rho ?? 7.85,
            name: s.sec ?? `CFTC ${Math.round(y.D * 1e3)}X${Math.round(y.t * 1e3)}`
          });
        }
        const L = c.frameCft.get(s.id);
        if (L) {
          const m = _e(L.b, L.h, L.t, s.E, p, L.Ec, L.nuC, L.tw);
          e.set(i, m.A), a.set(i, m.Iz), n.set(i, m.Iy), r.set(i, m.J), B.set(i, m.As2), J.set(i, m.As3), k.set(i, L.h), v.set(i, L.b);
          const j = (L.b - 2 * L.tw) * (L.h - 2 * L.t), R = L.b * L.h - j;
          f.set(i, ((s.rho ?? 7.85) * R + L.rhoC * j) / m.A);
          const U = (G) => Math.round(G * 1e3);
          u.set(i, {
            type: "CFT",
            b: L.b,
            h: L.h,
            tw: L.tw,
            tf: L.t,
            fillE: L.Ec,
            fillRho: L.rhoC,
            steelRho: s.rho ?? 7.85,
            name: s.sec ?? `CFT ${U(L.h)}X${U(L.b)}X${U(L.t)}${L.tw !== L.t ? `X${U(L.tw)}` : ""}`
          });
        }
      }
      if (c.meshCross) {
        const s = (M, h) => M[0] * h[0] + M[1] * h[1] + M[2] * h[2], d = [
          o,
          E,
          e,
          n,
          a,
          r,
          f,
          _,
          k,
          v,
          C,
          J,
          B,
          u,
          O
        ], w = (M, h) => {
          for (const A of d) A.has(M) && A.set(h, A.get(M));
        }, i = (M) => {
          for (let h = 0; h < $.length; h++) if (Math.hypot($[h][0] - M[0], $[h][1] - M[1], $[h][2] - M[2]) < 1e-6) return h;
          return $.push([
            M[0],
            M[1],
            M[2]
          ]), $.length - 1;
        }, p = (M) => {
          const h = $[M[0]], A = $[M[1]];
          return [
            Math.min(h[0], A[0]),
            Math.min(h[1], A[1]),
            Math.min(h[2], A[2]),
            Math.max(h[0], A[0]),
            Math.max(h[1], A[1]),
            Math.max(h[2], A[2])
          ];
        };
        let g = 0;
        for (let M = 0; M < I.length; M++) {
          if (I[M].length !== 2) continue;
          const h = p(I[M]);
          for (let A = M + 1; A < I.length; A++) {
            if (I[A].length !== 2) continue;
            const [z, F] = I[M], [x, y] = I[A];
            if (z === x || z === y || F === x || F === y) continue;
            const L = p(I[A]);
            if (h[0] > L[3] + 1e-6 || L[0] > h[3] + 1e-6 || h[1] > L[4] + 1e-6 || L[1] > h[4] + 1e-6 || h[2] > L[5] + 1e-6 || L[2] > h[5] + 1e-6) continue;
            const m = $[z], j = $[F], R = $[x], U = $[y], G = [
              j[0] - m[0],
              j[1] - m[1],
              j[2] - m[2]
            ], V = [
              U[0] - R[0],
              U[1] - R[1],
              U[2] - R[2]
            ], ie = [
              m[0] - R[0],
              m[1] - R[1],
              m[2] - R[2]
            ], Le = s(G, G), xe = s(G, V), Ce = s(V, V), Oe = s(G, ie), ze = s(V, ie), Ae = Le * Ce - xe * xe;
            if (Ae < 1e-10 * Le * Ce) continue;
            const Ie = (xe * ze - Ce * Oe) / Ae, ve = (Le * ze - xe * Oe) / Ae;
            if (Ie < 1e-6 || Ie > 1 - 1e-6 || ve < 1e-6 || ve > 1 - 1e-6) continue;
            const ye = [
              m[0] + Ie * G[0],
              m[1] + Ie * G[1],
              m[2] + Ie * G[2]
            ], Se = [
              R[0] + ve * V[0],
              R[1] + ve * V[1],
              R[2] + ve * V[2]
            ];
            if (Math.hypot(ye[0] - Se[0], ye[1] - Se[1], ye[2] - Se[2]) > 1e-6) continue;
            const Te = i(ye);
            for (const Me of [
              M,
              A
            ]) {
              const [We, Ne] = I[Me], $e = I.length;
              I[Me] = [
                We,
                Te
              ], I.push([
                Te,
                Ne
              ]), w(Me, $e);
              const Ee = b.get(Me);
              Ee && (b.set(Me, [
                ...Ee.slice(0, 6),
                ...Array(6).fill(false)
              ]), b.set($e, [
                ...Array(6).fill(false),
                ...Ee.slice(6)
              ]));
              const ke = T.get(Me);
              ke && (T.set(Me, [
                ke[0],
                0,
                ke[2]
              ]), T.set($e, [
                0,
                ke[1],
                ke[2]
              ]));
            }
            g++;
          }
        }
        g > 0 && console.log(`[CLI Modeler] ${g} cruces de barras partidos con nudo (como ETABS; meshcross 0 lo apaga)`);
      }
      for (const s of c.shells) {
        const d = s.pts.map((g) => S.get(g));
        if (d.some((g) => g === void 0)) {
          c.errors.push(`shell ${s.id}: algun nodo inexistente`);
          continue;
        }
        const w = I.length;
        X.set(s.id, w), I.push(d), o.set(w, s.E), E.set(w, s.E / (2 * 1.2)), H.set(w, s.t), f.set(w, s.rho ?? 2.45), _.set(w, 0.2);
        const i = c.shellTypes.get(s.id);
        i !== void 0 && W.set(w, i);
        const p = c.deckSecs.get(s.id);
        if (p) {
          const g = p.tc + (p.sr > 0 ? p.hr * (p.wrt + p.wrb) / 2 / p.sr : 0);
          H.set(w, p.tc), f.set(w, ((s.rho ?? 2.45) * g + p.w / 9.80665) / p.tc), Y.set(w, {
            ...p
          });
        }
      }
      const se = /* @__PURE__ */ new Map();
      for (const [s, d] of c.supports.entries()) {
        const w = S.get(s);
        w !== void 0 && se.set(w, d);
      }
      const N = /* @__PURE__ */ new Map();
      for (const [s, d] of c.loads.entries()) {
        const w = S.get(s);
        w !== void 0 && N.set(w, [
          ...d
        ]);
      }
      const fe = /* @__PURE__ */ new Map();
      for (const [s, d] of c.diaphragms.entries()) {
        const w = S.get(s);
        w !== void 0 && fe.set(w, d);
      }
      const re = /* @__PURE__ */ new Map();
      for (const [s, d] of c.masses.entries()) {
        const w = S.get(s);
        w !== void 0 && re.set(w, d);
      }
      const K = /* @__PURE__ */ new Map();
      for (const [s, d] of c.loadsPat) {
        const w = /* @__PURE__ */ new Map();
        for (const [i, p] of d) {
          const g = S.get(i);
          g !== void 0 && w.set(g, [
            ...p
          ]);
        }
        K.set(s, w);
      }
      const be = [
        [
          c.frameLoads,
          N
        ]
      ];
      for (const [s, d] of c.frameLoadsPat) K.has(s) || K.set(s, /* @__PURE__ */ new Map()), be.push([
        d,
        K.get(s)
      ]);
      for (const [s, d] of be) if (s.size) {
        const w = (i, p) => {
          const g = d.get(i) ?? [
            0,
            0,
            0,
            0,
            0,
            0
          ];
          d.set(i, [
            g[0] + p[0],
            g[1] + p[1],
            g[2] + p[2],
            g[3] + p[3],
            g[4] + p[4],
            g[5] + p[5]
          ]);
        };
        for (const [i, p] of s.entries()) {
          const g = c.frames.find((j) => j.id === i);
          if (!g) {
            c.errors.push(`frameload ${i}: no existe esa barra`);
            continue;
          }
          const M = S.get(g.nI), h = S.get(g.nJ);
          if (M === void 0 || h === void 0) continue;
          const A = $[M], z = $[h], F = [
            z[0] - A[0],
            z[1] - A[1],
            z[2] - A[2]
          ], x = Math.hypot(F[0], F[1], F[2]);
          if (x < 1e-9) continue;
          const y = [
            F[0] / x,
            F[1] / x,
            F[2] / x
          ], L = x * x / 12, m = [
            y[1] * p[2] - y[2] * p[1],
            y[2] * p[0] - y[0] * p[2],
            y[0] * p[1] - y[1] * p[0]
          ];
          w(M, [
            p[0] * x / 2,
            p[1] * x / 2,
            p[2] * x / 2,
            L * m[0],
            L * m[1],
            L * m[2]
          ]), w(h, [
            p[0] * x / 2,
            p[1] * x / 2,
            p[2] * x / 2,
            -L * m[0],
            -L * m[1],
            -L * m[2]
          ]);
        }
      }
      const pe = /* @__PURE__ */ new Map(), Q = 1 / Math.sqrt(3), ce = [
        [
          -Q,
          -Q
        ],
        [
          Q,
          -Q
        ],
        [
          Q,
          Q
        ],
        [
          -Q,
          Q
        ]
      ];
      for (const s of c.shells) {
        const d = c.shellLoads.get(s.id);
        if (!d || c.deckTributario.has(s.id)) continue;
        const w = s.pts.map((g) => S.get(g));
        if (w.some((g) => g === void 0)) {
          c.errors.push(`areaload ${s.id}: algun nodo inexistente`);
          continue;
        }
        const i = w.map((g) => $[g]), p = [
          0,
          0,
          0,
          0
        ];
        for (const [g, M] of ce) {
          const h = [
            0.25 * (1 - g) * (1 - M),
            0.25 * (1 + g) * (1 - M),
            0.25 * (1 + g) * (1 + M),
            0.25 * (1 - g) * (1 + M)
          ], A = [
            -0.25 * (1 - M),
            0.25 * (1 - M),
            0.25 * (1 + M),
            -0.25 * (1 + M)
          ], z = [
            -0.25 * (1 - g),
            -0.25 * (1 + g),
            0.25 * (1 + g),
            0.25 * (1 - g)
          ], F = [
            0,
            1,
            2
          ].map((m) => A.reduce((j, R, U) => j + R * i[U][m], 0)), x = [
            0,
            1,
            2
          ].map((m) => z.reduce((j, R, U) => j + R * i[U][m], 0)), y = [
            F[1] * x[2] - F[2] * x[1],
            F[2] * x[0] - F[0] * x[2],
            F[0] * x[1] - F[1] * x[0]
          ], L = Math.hypot(y[0], y[1], y[2]);
          for (let m = 0; m < 4; m++) p[m] += h[m] * d * L;
        }
        for (let g = 0; g < 4; g++) {
          const M = w[g], h = N.get(M) ?? [
            0,
            0,
            0,
            0,
            0,
            0
          ];
          h[2] += p[g], N.set(M, h), pe.set(M, (pe.get(M) ?? 0) + p[g]);
        }
      }
      if (c.selfWeight) {
        const d = /* @__PURE__ */ new Set();
        for (const [i, p] of X) c.deckTributario.has(i) && d.add(p);
        const w = (i, p) => {
          const g = N.get(i) ?? [
            0,
            0,
            0,
            0,
            0,
            0
          ];
          g[2] += p, N.set(i, g);
        };
        I.forEach((i, p) => {
          const g = f.get(p) ?? 0;
          if (g && !d.has(p)) {
            if (i.length === 2) {
              const M = e.get(p) ?? 0, h = $[i[0]], A = $[i[1]], z = [
                A[0] - h[0],
                A[1] - h[1],
                A[2] - h[2]
              ];
              let F = Math.hypot(z[0], z[1], z[2]);
              const x = T.get(p);
              if (x) {
                const G = Math.hypot(z[0], z[1]);
                G > 1e-9 && Math.abs(Math.atan2(Math.abs(z[2]), G)) * 180 / Math.PI < 20 && (F = Math.max(F - x[0] - x[1], 0));
              }
              const y = Math.hypot(z[0], z[1], z[2]), L = -M * g * 9.80665 * c.selfWeight, m = [
                z[0] / y,
                z[1] / y,
                z[2] / y
              ], j = F * F / 12, R = [
                m[1] * L,
                -m[0] * L,
                0
              ], U = (G, V) => {
                const ie = N.get(G) ?? [
                  0,
                  0,
                  0,
                  0,
                  0,
                  0
                ];
                N.set(G, [
                  ie[0] + V[0],
                  ie[1] + V[1],
                  ie[2] + V[2],
                  ie[3] + V[3],
                  ie[4] + V[4],
                  ie[5] + V[5]
                ]);
              };
              U(i[0], [
                0,
                0,
                L * F / 2,
                j * R[0],
                j * R[1],
                0
              ]), U(i[1], [
                0,
                0,
                L * F / 2,
                -j * R[0],
                -j * R[1],
                0
              ]);
            } else if (i.length === 4) {
              const M = H.get(p) ?? 0, h = i.map((F) => $[F]);
              let A = 0;
              for (let F = 1; F < 3; F++) {
                const x = [
                  h[F][0] - h[0][0],
                  h[F][1] - h[0][1],
                  h[F][2] - h[0][2]
                ], y = [
                  h[F + 1][0] - h[0][0],
                  h[F + 1][1] - h[0][1],
                  h[F + 1][2] - h[0][2]
                ], L = [
                  x[1] * y[2] - x[2] * y[1],
                  x[2] * y[0] - x[0] * y[2],
                  x[0] * y[1] - x[1] * y[0]
                ];
                A += Math.hypot(L[0], L[1], L[2]) / 2;
              }
              const z = A * M * g * 9.80665 * c.selfWeight;
              for (const F of i) w(F, -z / 4);
            }
          }
        });
      }
      const te = [];
      for (const s of c.springs) {
        const d = S.get(s.node);
        d !== void 0 && te.push({
          node: d,
          dof: s.dof,
          k: s.k
        });
      }
      for (const s of c.areaSprings) {
        const d = X.get(s.id);
        if (d === void 0) {
          c.errors.push(`areaspring ${s.id}: no existe esa cascara`);
          continue;
        }
        te.push({
          node: -(d + 1),
          dof: s.nodal ? -3 : -1,
          k: s.ks
        });
      }
      if (c.edgeEtabs) {
        const s = /* @__PURE__ */ new Set(), d = [];
        I.forEach((i, p) => {
          if (i.length === 3 || i.length === 4) {
            d.push(p);
            for (const g of i) s.add(g);
          }
        });
        let w = 0;
        for (const i of d) {
          const p = I[i], g = p.map((h) => $[h]), M = [
            0,
            1,
            2
          ].map((h) => [
            Math.min(...g.map((A) => A[h])),
            Math.max(...g.map((A) => A[h]))
          ]);
          for (let h = 0; h < $.length; h++) {
            if (p.includes(h)) continue;
            const A = $[h];
            if (A[0] < M[0][0] - 1e-6 || A[0] > M[0][1] + 1e-6 || A[1] < M[1][0] - 1e-6 || A[1] > M[1][1] + 1e-6 || A[2] < M[2][0] - 1e-6 || A[2] > M[2][1] + 1e-6) continue;
            let z = false;
            for (let x = 0; x < p.length && !z; x++) {
              const y = g[x], L = g[(x + 1) % p.length], m = [
                L[0] - y[0],
                L[1] - y[1],
                L[2] - y[2]
              ], j = m[0] * m[0] + m[1] * m[1] + m[2] * m[2];
              if (j < 1e-24) continue;
              const R = [
                A[0] - y[0],
                A[1] - y[1],
                A[2] - y[2]
              ], U = (R[0] * m[0] + R[1] * m[1] + R[2] * m[2]) / j;
              if (U <= 1e-6 || U >= 1 - 1e-6) continue;
              const G = [
                R[0] - U * m[0],
                R[1] - U * m[1],
                R[2] - U * m[2]
              ];
              Math.hypot(G[0], G[1], G[2]) <= 1e-6 * Math.sqrt(j) && (z = true);
            }
            !z || !I.some((x, y) => y !== i && x.includes(h)) || (te.push({
              node: -(i + 1),
              dof: -2,
              k: h
            }), w++);
          }
        }
        w && console.log(`[CLI Modeler] edge etabs: ${w} nudo(s) colgado(s) atado(s) a su arista (Hermite)`);
      }
      const ne = [];
      for (const s of c.solids) {
        const d = s.pts.map((i) => S.get(i));
        if (d.some((i) => i === void 0)) {
          c.errors.push(`hex ${s.id}: algun nodo inexistente`);
          continue;
        }
        const w = I.length;
        I.push(d), o.set(w, s.E), _.set(w, s.nu), E.set(w, s.E / (2 * (1 + s.nu))), f.set(w, s.rho), ne.push(w);
      }
      t.nodes.val = $, t.elements.val = I, t.nodeInputs.val = {
        supports: se,
        loads: N,
        masses: re,
        diaphragms: fe,
        springs: te
      }, t.springs && (t.springs.val = te);
      const oe = /* @__PURE__ */ new Map(), he = /* @__PURE__ */ new Map(), ue = /* @__PURE__ */ new Map(), Fe = /* @__PURE__ */ new Map(), me = /* @__PURE__ */ new Map();
      for (const s of c.shells) {
        const d = X.get(s.id);
        if (d === void 0) continue;
        const w = c.shellLoads.get(s.id);
        w !== void 0 && Fe.set(d, w);
        const i = c.shellAngles.get(s.id);
        i !== void 0 && me.set(d, i);
        const p = c.shellModsDir.get(s.id);
        if (p) {
          ue.set(d, p), oe.set(d, (p[0] + p[1]) / 2), he.set(d, (p[3] + p[4]) / 2);
          continue;
        }
        const g = c.shellMods.get(s.id);
        g ? (oe.set(d, g[0]), he.set(d, g[1])) : c.deckSecs.has(s.id) && (oe.set(d, 1), he.set(d, 0));
      }
      if (t.elementInputs.val = {
        elasticities: o,
        shearModuli: E,
        areas: e,
        momentsOfInertiaY: n,
        momentsOfInertiaZ: a,
        torsionalConstants: c.torsionFactor !== 1 ? new Map([
          ...r
        ].map(([s, d]) => [
          s,
          d * c.torsionFactor
        ])) : r,
        densities: f,
        poissonsRatios: _,
        thicknesses: H,
        membraneModifiers: oe,
        bendingModifiers: he,
        shellModifiers: ue,
        shellSurfaceLoads: Fe,
        shellAngles: me,
        cargaDeArea: pe,
        cantos: k,
        anchos: v,
        sectionShapes: u,
        localAngles: C,
        shearAreasY: J,
        shearAreasZ: B,
        momentReleases: b,
        endOffsets: T,
        plateFormulations: W,
        deckSections: Y,
        frameLoads: O,
        meshAtIntersections: c.meshCross,
        solidIncompatible: c.solidIncompatible,
        selfWeight: c.selfWeight,
        etabsWallJoint: c.etabsWallJoint,
        areaObjects: c.areaObjs.map((s) => ({
          nodes: s.pts.map((d) => S.get(d)).filter((d) => d !== void 0),
          cells: s.cells.map((d) => X.get(d)).filter((d) => d !== void 0),
          q: s.cells.map((d) => c.shellLoads.get(d)).find((d) => d !== void 0),
          ang: s.cells.map((d) => c.shellAngles.get(d)).find((d) => d !== void 0)
        })).filter((s) => s.nodes.length === 4 && s.cells.length > 0)
      }, c.doSolve && ne.length > 0 && ne.length === I.length) try {
        const s = o.get(ne[0]) ?? 25e6, d = _.get(ne[0]) ?? 0.2;
        ne.some((M) => Math.abs((o.get(M) ?? s) - s) > 1e-9 * s || Math.abs((_.get(M) ?? d) - d) > 1e-12) && c.errors.push("hex: hex8Solve lleva UN material; los solidos tienen E o nu distintos y se usa el del primero");
        const w = /* @__PURE__ */ new Map();
        for (const [M, h] of t.nodeInputs.val.supports ?? []) w.set(M, [
          !!h[0],
          !!h[1],
          !!h[2]
        ]);
        const i = /* @__PURE__ */ new Map();
        for (const [M, h] of je({
          Dead: N,
          ...Object.fromEntries(K)
        })) i.set(M, [
          h[0] ?? 0,
          h[1] ?? 0,
          h[2] ?? 0
        ]);
        const p = Pe({
          nodes: $,
          elements: I,
          E: s,
          nu: d,
          supports: w,
          loads: i,
          incompatible: c.solidIncompatible
        }), g = /* @__PURE__ */ new Map();
        p.displacements.forEach(([M, h, A], z) => g.set(z, [
          M,
          h,
          A,
          0,
          0,
          0
        ])), t.deformOutputs.val = {
          deformations: g,
          reactions: /* @__PURE__ */ new Map()
        }, t.analyzeOutputs.val = {
          solidStress: p.stressPerElement,
          solidVonMises: p.vonMisesPerElement
        }, console.log(`[CLI Modeler] Solve OK \u2014 ${I.length} solidos H8, ${$.length} nodos (${p.elapsedMs.toFixed(0)} ms)`);
      } catch (s) {
        c.errors.push(`hex8Solve: ${(s == null ? void 0 : s.message) ?? s}`);
      }
      else if (c.doSolve && $.length && I.length) try {
        window.__hekatanCliSprings = te;
        const s = je({
          Dead: N,
          ...Object.fromEntries(K)
        });
        t.deformOutputs.val = Ze($, I, {
          ...t.nodeInputs.val,
          loads: s
        }, t.elementInputs.val, te.length ? te : void 0);
        try {
          t.analyzeOutputs.val = Ye($, I, t.elementInputs.val, t.deformOutputs.val);
        } catch (d) {
          console.warn("[CLI Modeler] analyze:", (d == null ? void 0 : d.message) ?? d);
        }
        if (c.areaSprings.length > 0) try {
          const d = t.deformOutputs.val.deformations, w = t.analyzeOutputs.val ?? {}, i = w.pressure instanceof Map ? w.pressure : /* @__PURE__ */ new Map();
          let p = 0, g = 0;
          for (const M of c.areaSprings) {
            const h = X.get(M.id);
            if (h === void 0) continue;
            const z = I[h].map((F) => {
              var _a2;
              const x = ((_a2 = d.get(F)) == null ? void 0 : _a2[2]) ?? 0, y = M.ks * x;
              return y < p && (p = y), y > g && (g = y), y;
            });
            i.set(h, z);
          }
          i.size > 0 && (w.pressure = i, w.colorMapRanges = {
            ...w.colorMapRanges ?? {},
            pressure: [
              g,
              p
            ]
          }, t.analyzeOutputs.val = w, console.log(`[CLI Modeler] presi\xF3n Winkler: ${i.size} shells, \u03C3 ${p.toFixed(0)}..${g.toFixed(0)} kN/m\xB2`));
        } catch (d) {
          console.warn("[CLI Modeler] presi\xF3n:", (d == null ? void 0 : d.message) ?? d);
        }
        if (ne.length > 0) try {
          const d = t.deformOutputs.val.deformations, w = /* @__PURE__ */ new Map(), i = /* @__PURE__ */ new Map();
          for (const p of ne) {
            const g = I[p], M = g.map((z) => $[z]), h = g.flatMap((z) => {
              const F = d.get(z) ?? [
                0,
                0,
                0
              ];
              return [
                F[0],
                F[1],
                F[2]
              ];
            }), A = Ue(M, o.get(p) ?? 25e6, _.get(p) ?? 0.2, h, c.solidIncompatible);
            w.set(p, A.stress), i.set(p, A.vonMises);
          }
          t.analyzeOutputs.val = {
            ...t.analyzeOutputs.val ?? {},
            solidStress: w,
            solidVonMises: i
          };
        } catch (d) {
          console.warn("[CLI Modeler] tensiones de solidos:", (d == null ? void 0 : d.message) ?? d);
        }
        console.log("[CLI Modeler] Solve OK \u2014", I.length, "elementos,", $.length, "nodos");
      } catch (s) {
        c.errors.push(`solve fall\xF3: ${s.message}`);
      }
      if (t.objects3D.val = [], c.errors.length) {
        console.warn("[CLI Modeler] Errores:");
        for (const s of c.errors) console.warn("  -", s);
      }
      window.__hekatanCliErrors = c.errors;
      let ee = 0, ge = 0;
      const le = t.deformOutputs.val;
      if ((_a = le == null ? void 0 : le.deformations) == null ? void 0 : _a.size) for (const [, s] of le.deformations) Math.abs(s[2]) > Math.abs(ee) && (ee = s[2]);
      if ((_b = le == null ? void 0 : le.reactions) == null ? void 0 : _b.size) for (const [, s] of le.reactions) ge += s[2] || 0;
      window.__hekatanCliStats = {
        nodes: $.length,
        frames: c.frames.length,
        shells: c.shells.length,
        supports: se.size,
        loads: N.size,
        springs: te.length,
        solved: c.doSolve,
        errors: c.errors.length,
        maxUzMm: +(ee * 1e3).toFixed(3),
        sumRz: +ge.toFixed(1)
      };
    }
  };
});
export {
  __tla,
  is as c,
  Ve as p
};
