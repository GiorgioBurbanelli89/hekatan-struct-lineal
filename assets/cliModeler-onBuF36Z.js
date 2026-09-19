import { i as _e, t as Pe, c as qe, d as Be, a as Ue, b as Ge } from "./cadSections-BcRFaG1j.js";
import { c as We } from "./cargasPorCaso-B_GZ_-rO.js";
import { h as Ye, a as Ve, __tla as __tla_0 } from "./h8-Dq5Es-cV.js";
import { a as Ze, __tla as __tla_1 } from "./analyze-BBVI7quz.js";
import { m as He, d as Ke, __tla as __tla_2 } from "./didacticCpp-Czy7NlhT.js";
let ds, es;
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
  })(),
  (() => {
    try {
      return __tla_2;
    } catch {
    }
  })()
]).then(async () => {
  const Qe = false, Oe = {
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
  function je(f) {
    const t = f.toLowerCase().trim();
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
    const J = [
      false,
      false,
      false,
      false,
      false,
      false
    ], c = t.split(/[\s,]+/).filter(Boolean);
    if (c.length > 1 && c.length <= 6 && c.every((E) => E === "0" || E === "1")) return c.forEach((E, B) => {
      J[B] = E === "1";
    }), J;
    for (const E of c) Oe[E] !== void 0 && (J[Oe[E]] = true);
    if (/^[01]+$/.test(t) && t.length <= 6) for (let E = 0; E < t.length; E++) J[E] = t[E] === "1";
    return J;
  }
  es = function(f) {
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
      frameCanal: /* @__PURE__ */ new Map(),
      frameDosL: /* @__PURE__ */ new Map(),
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
      combos: [],
      edgeEtabs: false,
      edgeLineal: false,
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
    let J = null, c = 0, E = 0, B = 0;
    const D = f.split(/\r?\n/);
    for (let U = 0; U < D.length; U++) {
      let k = D[U].trim();
      if (!k || k.startsWith("#") || k.startsWith("//")) continue;
      k = k.replace(/[;]+$/, "");
      const o = k.split(/\s+/), T = o[0].toLowerCase();
      if (T === "nodes" && o.length === 1) {
        J = "nodes";
        continue;
      }
      if ((T === "elements" || T === "frames") && o.length === 1) {
        J = "elements";
        continue;
      }
      if (T === "areas" && o.length === 1) {
        J = "areas";
        continue;
      }
      if (T === "supports" && o.length === 1) {
        J = "supports";
        continue;
      }
      if (T === "loads" && o.length === 1) {
        J = "loads";
        continue;
      }
      if (T === "springs" && o.length === 1) {
        J = "springs";
        continue;
      }
      if (J && /^[\-\d]/.test(o[0])) {
        const e = o.map(parseFloat);
        if (J === "nodes" && e.length >= 3) {
          c++, t.nodes.set(c, [
            e[0],
            e[1],
            e[2]
          ]);
          continue;
        }
        if (J === "elements" && e.length >= 2) {
          E++, t.frames.push({
            id: E,
            nI: e[0] + 1,
            nJ: e[1] + 1,
            E: 25e6,
            A: 0.16,
            I: 21e-4
          });
          continue;
        }
        if (J === "areas" && e.length >= 4) {
          B++, t.shells.push({
            id: B,
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
        if (J === "loads" && e.length >= 4) {
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
        if (J === "springs" && e.length >= 3) {
          t.springs.push({
            node: e[0],
            dof: e[1],
            k: e[2]
          });
          continue;
        }
      }
      if (J === "supports" && /^\d/.test(o[0])) {
        const e = parseInt(o[0], 10), n = o.slice(1).join(" ");
        t.supports.set(e, je(n));
        continue;
      }
      J && !/^[\-\d]/.test(o[0]) && (J = null);
      try {
        switch (T) {
          case "node":
          case "n": {
            const e = parseInt(o[1], 10), n = parseFloat(o[2]), a = parseFloat(o[3]), r = parseFloat(o[4]);
            !isFinite(e) || !isFinite(n) || !isFinite(a) || !isFinite(r) ? t.errors.push(`L${U + 1}: node mal formado: ${k}`) : t.nodes.set(e, [
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
            const e = parseInt(o[1], 10), n = parseInt(o[2], 10), a = parseInt(o[3], 10), r = parseFloat(o[4] ?? "25e6"), l = parseFloat(o[5] ?? "0.16"), F = parseFloat(o[6] ?? "0.001"), v = o[7] !== void 0 ? parseFloat(o[7]) : void 0, u = o[8] !== void 0 ? parseFloat(o[8]) : void 0, $ = o[9] !== void 0 ? parseFloat(o[9]) : void 0, I = o[10] !== void 0 ? parseFloat(o[10]) : void 0, j = o[11] !== void 0 ? parseFloat(o[11]) : void 0, N = o[12] !== void 0 ? parseFloat(o[12]) : void 0, Z = o.indexOf("#"), W = Z >= 0 && o[Z + 1] ? o[Z + 1] : void 0;
            t.frames.push({
              id: e,
              nI: n,
              nJ: a,
              E: r,
              A: l,
              I: F,
              Iy: v,
              J: u,
              nu: $,
              rho: I,
              D: j,
              B: N,
              sec: W
            });
            break;
          }
          case "cftc": {
            const e = parseInt(o[1], 10), n = parseFloat(o[2] ?? ""), a = parseFloat(o[3] ?? ""), r = parseFloat(o[4] ?? "25e6"), l = parseFloat(o[5] ?? "0.2"), F = parseFloat(o[6] ?? "2.4");
            isFinite(e) && n > 0 && a > 0 && a < n / 2 && r > 0 ? t.frameCftc.set(e, {
              D: n,
              t: a,
              Ec: r,
              nuC: isFinite(l) ? l : 0.2,
              rhoC: isFinite(F) && F >= 0 ? F : 2.4
            }) : t.errors.push(`cftc ${o[1]}: hace falta D t (m) y Ec (kN/m2), con t < D/2`);
            break;
          }
          case "isec":
          case "perfili": {
            const e = parseInt(o[1], 10), n = o.slice(2, 8).map(($) => parseFloat($)), [a, r, l, F] = n, v = isFinite(n[4]) ? n[4] : r, u = isFinite(n[5]) ? n[5] : l;
            isFinite(e) && a > 0 && r > 0 && l > 0 && F > 0 && v > 0 && u > 0 && l + u < a && F < Math.min(r, v) ? t.frameISec.set(e, {
              d: a,
              bf: r,
              tf: l,
              tw: F,
              t2b: v,
              tfb: u
            }) : t.errors.push(`isec ${o[1]}: hace falta d bf tf tw [t2b tfb] (m), con tf+tfb < d y tw < bf`);
            break;
          }
          case "tubo":
          case "tube": {
            const e = parseInt(o[1], 10), [n, a, r, l] = o.slice(2, 6).map((F) => parseFloat(F));
            isFinite(e) && n > 0 && a > 0 && r > 0 && l > 0 && l < n / 2 && r < a / 2 ? t.frameTube.set(e, {
              b: n,
              h: a,
              tf: r,
              tw: l
            }) : t.errors.push(`tubo ${o[1]}: hace falta b h tf tw (m), con tw < b/2 y tf < h/2`);
            break;
          }
          case "canal":
          case "channel": {
            const e = parseInt(o[1], 10), [n, a, r, l] = o.slice(2, 6).map((F) => parseFloat(F));
            isFinite(e) && n > 0 && a > 0 && r > 0 && l > 0 && 2 * r < n && l < a ? t.frameCanal.set(e, {
              d: n,
              bf: a,
              tf: r,
              tw: l
            }) : t.errors.push(`canal ${o[1]}: hace falta d bf tf tw (m), con 2\xB7tf < d y tw < bf`);
            break;
          }
          case "dosl":
          case "2l": {
            const e = parseInt(o[1], 10), [n, a, r, l, F] = o.slice(2, 7).map((u) => parseFloat(u)), v = (a - (F || 0)) / 2;
            isFinite(e) && n > 0 && a > 0 && r > 0 && l > 0 && F >= 0 && v > l && r < n ? t.frameDosL.set(e, {
              d: n,
              t2: a,
              tf: r,
              tw: l,
              dis: F
            }) : t.errors.push(`dosl ${o[1]}: hace falta d t2 tf tw dis (m), con (t2 \u2212 dis)/2 > tw`);
            break;
          }
          case "cft": {
            const e = parseInt(o[1], 10), n = o.slice(2).map((N) => parseFloat(N)), a = n.length >= 5 && n[3] < 1 && n[4] >= 1, r = n[0], l = n[1], F = n[2], v = a ? n[3] : n[2], u = a ? 4 : 3, $ = isFinite(n[u]) ? n[u] : 25e6, I = isFinite(n[u + 1]) ? n[u + 1] : 0.2, j = isFinite(n[u + 2]) ? n[u + 2] : 2.4;
            isFinite(e) && r > 0 && l > 0 && F > 0 && v > 0 && v < r / 2 && F < l / 2 && $ > 0 ? t.frameCft.set(e, {
              b: r,
              h: l,
              t: F,
              tw: v,
              Ec: $,
              nuC: I,
              rhoC: j >= 0 ? j : 2.4
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
            if (n.length === 2 && n.every((r) => /^(pin|fix|libre|rigido)$/.test(r))) n.forEach((r, l) => {
              (r === "pin" || r === "libre") && (a[l * 6 + 4] = true, a[l * 6 + 5] = true);
            });
            else {
              const r = n.filter((l) => l === "0" || l === "1");
              if (r.length !== 12) {
                t.errors.push(`release ${e}: hacen falta 12 banderas (U1 U2 U3 R1 R2 R3 en I y en J), llegaron ${r.length}`);
                break;
              }
              for (let l = 0; l < 12; l++) a[l] = r[l] === "1";
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
            const e = parseInt(o[1], 10), n = parseFloat(o[2] ?? "0"), a = o.slice(3).some((l) => /^(nodal|lumped|sap|etabs)$/i.test(l)), r = o.slice(3).some((l) => /^(compresion|compression|compressiononly|solocompresion)$/i.test(l));
            isFinite(e) && isFinite(n) && n !== 0 ? t.areaSprings.push({
              id: e,
              ks: n,
              nodal: a,
              comp: r
            }) : t.errors.push("areaspring: uso areaspring <shellID> <ks> [nodal]");
            break;
          }
          case "edge":
          case "edgeconstraint": {
            const e = (o[1] ?? "etabs").toLowerCase();
            t.edgeEtabs = e === "etabs" || e === "1" || e === "on" || e === "si" || e === "hermite", t.edgeLineal = e === "lineal" || e === "linear" || e === "safe" || e === "sap" || e === "linea", t.edgeLineal && !Qe ? (t.errors.push("edge lineal: este motor aun no lo aplica (llega con el WASM nuevo); los nudos colgados quedan sin atar"), t.edgeLineal = false) : t.edgeLineal && (t.edgeEtabs = true);
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
            ], a = parseFloat(o[6] ?? "0.20"), r = parseFloat(o[7] ?? "25e6"), l = o[9] !== void 0 ? parseFloat(o[9]) : void 0, F = l !== void 0 && isFinite(l) ? l : void 0;
            if (t.shells.push({
              id: e,
              pts: n,
              t: a,
              E: r,
              rho: F
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
            const e = o.slice(1).map((I) => parseInt(I, 10));
            if (e.length < 7 || e.some((I) => !isFinite(I))) {
              t.errors.push('areaobj: se esperaba "areaobj ID n1 n2 n3 n4 desdeShell hastaShell"');
              break;
            }
            const [n, a, r, l, F, v, u] = e, $ = [];
            for (let I = v; I <= u; I++) $.push(I);
            t.areaObjs.push({
              id: n,
              pts: [
                a,
                r,
                l,
                F
              ],
              cells: $
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
            const e = parseInt(o[1], 10), n = o.findIndex((r, l) => l >= 2 && r.startsWith("#")), a = o.slice(2, n < 0 ? void 0 : n).join(" ");
            t.supports.set(e, je(a));
            break;
          }
          case "load":
          case "l": {
            const e = parseInt(o[1], 10), n = parseFloat(o[2] ?? "0"), a = parseFloat(o[3] ?? "0"), r = parseFloat(o[4] ?? "0"), l = parseFloat(o[5] ?? "0"), F = parseFloat(o[6] ?? "0"), v = parseFloat(o[7] ?? "0"), u = o[8] && isNaN(parseFloat(o[8])) ? o[8] : "Dead";
            /^dead$/i.test(u) ? t.loads.set(e, [
              n,
              a,
              r,
              l,
              F,
              v
            ]) : (t.loadsPat.has(u) || t.loadsPat.set(u, /* @__PURE__ */ new Map()), t.loadsPat.get(u).set(e, [
              n,
              a,
              r,
              l,
              F,
              v
            ]));
            break;
          }
          case "frameload":
          case "fl": {
            const e = parseInt(o[1], 10), n = parseFloat(o[2] ?? "0"), a = parseFloat(o[3] ?? "0"), r = parseFloat(o[4] ?? "0"), l = o[5] && isNaN(parseFloat(o[5])) ? o[5] : "Dead", F = /^dead$/i.test(l) ? t.frameLoads : t.frameLoadsPat.get(l) ?? (t.frameLoadsPat.set(l, /* @__PURE__ */ new Map()), t.frameLoadsPat.get(l)), v = F.get(e) ?? [
              0,
              0,
              0
            ];
            F.set(e, [
              v[0] + n,
              v[1] + a,
              v[2] + r
            ]);
            break;
          }
          case "spring": {
            const e = parseInt(o[1], 10), n = (o[2] ?? "uz").toLowerCase(), a = Oe[n] ?? 2, r = parseFloat(o[3] ?? "1000");
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
            Number.isFinite(e) && Number.isFinite(n) ? t.masses.set(e, (t.masses.get(e) ?? 0) + n) : t.errors.push(`L${U + 1}: mass necesita <nudo> <toneladas>`);
            break;
          }
          case "vista": {
            const e = o.slice(1).filter((n) => !/^resultados?$/i.test(n));
            e[0] && (t.vista = {
              campo: e[0],
              caso: e[1]
            });
            break;
          }
          case "fc": {
            const e = parseFloat(o[1]);
            isFinite(e) && e > 0 ? t.fc = e : t.errors.push("fc: uso fc <kN/m2>");
            break;
          }
          case "combo":
          case "combinacion": {
            const e = o[1], n = [];
            for (let a = 2; a + 1 < o.length; a += 2) {
              const r = parseFloat(o[a + 1]);
              isFinite(r) && n.push([
                o[a],
                r
              ]);
            }
            e && n.length ? t.combos.push({
              name: e,
              items: n
            }) : t.errors.push("combo: uso combo NOMBRE patron factor [patron factor ...]");
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
            t.errors.push(`L${U + 1}: comando desconocido "${T}"`);
        }
      } catch (e) {
        t.errors.push(`L${U + 1}: error "${k}" \u2014 ${e.message}`);
      }
    }
    return t;
  };
  const ss = `# CLI Modeler \u2014 escrib\xED comandos para construir un modelo
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
`, V = (f, t) => [
    f[0] - t[0],
    f[1] - t[1],
    f[2] - t[2]
  ], fe = (f, t) => f[0] * t[0] + f[1] * t[1] + f[2] * t[2], Fe = (f, t) => [
    f[1] * t[2] - f[2] * t[1],
    f[2] * t[0] - f[0] * t[2],
    f[0] * t[1] - f[1] * t[0]
  ], K = (f) => Math.hypot(f[0], f[1], f[2]), ie = (f, t) => [
    f[0] * t,
    f[1] * t,
    f[2] * t
  ];
  function Xe(f, t) {
    const J = f.shellModsDir.get(t);
    return !!J && Math.abs(J[3]) < 1e-12 && Math.abs(J[4]) < 1e-12 && Math.abs(J[5]) < 1e-12;
  }
  function ts(f, t = 200, J) {
    const c = [
      0,
      1,
      2
    ].map((u) => (f[0][u] + f[1][u] + f[2][u] + f[3][u]) / 4);
    let E = V(f[1], f[0]), B = Fe(E, V(f[3], f[0]));
    B = ie(B, 1 / K(B)), E = ie(E, 1 / K(E));
    const D = Fe(B, E), U = f.map((u) => [
      fe(V(u, c), E),
      fe(V(u, c), D)
    ]);
    let k = [
      0,
      1,
      2,
      3
    ];
    if (J) {
      const u = [
        0,
        1,
        2,
        3
      ].map(($) => {
        const I = V(f[($ + 1) % 4], f[$]);
        return Math.abs(fe(I, J)) / K(I);
      });
      k = [
        0,
        1,
        2,
        3
      ].sort(($, I) => u[$] - u[I]).slice(0, 2);
    }
    const o = U.map((u) => u[0]), T = U.map((u) => u[1]), e = Math.min(...o), n = Math.max(...o), a = Math.min(...T), r = Math.max(...T), l = [
      0,
      1,
      2,
      3
    ].map(() => ({
      pts: [],
      dA: 0
    }));
    let F = 0;
    for (let u = 0; u < t; u++) for (let $ = 0; $ < t; $++) {
      const I = e + (n - e) * (u + 0.5) / t, j = a + (r - a) * ($ + 0.5) / t;
      let N = 0, Z = 0;
      for (let q = 0; q < 4; q++) {
        const G = U[q], se = U[(q + 1) % 4];
        (se[0] - G[0]) * (j - G[1]) - (se[1] - G[1]) * (I - G[0]) >= 0 ? N++ : Z++;
      }
      if (N !== 4 && Z !== 4) continue;
      let W = k[0], X = 1 / 0;
      for (const q of k) {
        const G = U[q], se = U[(q + 1) % 4], ne = se[0] - G[0], R = se[1] - G[1], pe = ne * ne + R * R, ce = Math.max(0, Math.min(1, ((I - G[0]) * ne + (j - G[1]) * R) / pe)), te = Math.hypot(I - (G[0] + ce * ne), j - (G[1] + ce * R));
        te < X && (X = te, W = q);
      }
      l[W].pts.push([
        c[0] + I * E[0] + j * D[0],
        c[1] + I * E[1] + j * D[1],
        c[2] + I * E[2] + j * D[2]
      ]), F++;
    }
    const v = 0.5 * K(Fe(V(f[2], f[0]), V(f[3], f[1])));
    for (const u of l) u.dA = F ? v / F : 0;
    return l;
  }
  function os(f, t) {
    if (!(t > 0)) return;
    const J = 1e-6, c = (T) => f.nodes.get(T);
    let E = Math.max(0, ...f.nodes.keys()) + 1, B = f.shells.reduce((T, e) => Math.max(T, e.id), 0) + 1;
    const D = (T) => {
      for (const [n, a] of f.nodes) if (K(V(a, T)) < J) return n;
      const e = E++;
      return f.nodes.set(e, [
        T[0],
        T[1],
        T[2]
      ]), e;
    }, U = (T, e) => {
      const n = f.shellModsDir.get(T);
      n && f.shellModsDir.set(e, [
        ...n
      ]);
      const a = f.shellMods.get(T);
      a && f.shellMods.set(e, [
        ...a
      ]);
      const r = f.shellLoads.get(T);
      r !== void 0 && f.shellLoads.set(e, r);
      const l = f.shellTypes.get(T);
      l !== void 0 && f.shellTypes.set(e, l);
      const F = f.shellAngles.get(T);
      F !== void 0 && f.shellAngles.set(e, F);
    }, k = [];
    let o = 0;
    for (const T of f.shells) {
      if (T.pts.length !== 4) {
        k.push(T);
        continue;
      }
      const e = T.pts.map(c);
      if (e.some((u) => !u)) {
        k.push(T);
        continue;
      }
      const n = (K(V(e[1], e[0])) + K(V(e[2], e[3]))) / 2, a = (K(V(e[3], e[0])) + K(V(e[2], e[1]))) / 2, r = Math.max(1, Math.ceil(n / t - 1e-9)), l = Math.max(1, Math.ceil(a / t - 1e-9));
      if (r === 1 && l === 1) {
        k.push(T);
        continue;
      }
      const F = (u, $) => [
        0,
        1,
        2
      ].map((I) => e[0][I] * (1 - u) * (1 - $) + e[1][I] * u * (1 - $) + e[2][I] * u * $ + e[3][I] * (1 - u) * $), v = [];
      for (let u = 0; u <= r; u++) {
        const $ = [];
        for (let I = 0; I <= l; I++) $.push(D(F(u / r, I / l)));
        v.push($);
      }
      for (let u = 0; u < r; u++) for (let $ = 0; $ < l; $++) {
        const I = u === 0 && $ === 0 ? T.id : B++;
        k.push({
          ...T,
          id: I,
          pts: [
            v[u][$],
            v[u + 1][$],
            v[u + 1][$ + 1],
            v[u][$ + 1]
          ]
        }), I !== T.id && U(T.id, I);
      }
      o++;
    }
    o && (f.shells = k, console.log(`[CLI Modeler] automesh ${t} m: ${o} pano(s) partido(s) -> ${f.shells.length} cascaras, ${f.nodes.size} nudos`));
  }
  function ns(f) {
    const J = (a) => f.nodes.get(a), c = [
      ...f.nodes.keys()
    ], E = (a, r, l) => {
      const F = V(r, a), v = K(F), u = ie(F, 1 / v), $ = [];
      for (const I of c) {
        if (l.includes(I)) continue;
        const j = V(J(I), a), N = fe(j, u);
        N > 1e-6 && N < v - 1e-6 && K(V(j, ie(u, N))) < 1e-4 && $.push(N / v);
      }
      return $.sort((I, j) => I - j);
    }, B = (a, r) => {
      const l = [];
      for (const F of a) r.some((v) => Math.abs(F - v) < 1e-5) && !l.some((v) => Math.abs(F - v) < 1e-5) && l.push(F);
      return l;
    }, D = (a) => {
      for (const r of c) if (K(V(J(r), a)) < 1e-4) return r;
    };
    let U = f.shells.reduce((a, r) => Math.max(a, r.id), 0) + 1;
    const k = [], o = (a, r) => {
      const l = f.shellModsDir.get(a);
      l && f.shellModsDir.set(r, [
        ...l
      ]);
      const F = f.shellMods.get(a);
      F && f.shellMods.set(r, [
        ...F
      ]);
      const v = f.shellLoads.get(a);
      v !== void 0 && f.shellLoads.set(r, v);
      const u = f.shellTypes.get(a);
      u !== void 0 && f.shellTypes.set(r, u);
      const $ = f.shellAngles.get(a);
      $ !== void 0 && f.shellAngles.set(r, $);
    };
    for (const a of f.shells) {
      if (!Xe(f, a.id) || a.pts.length !== 4 || a.pts.some((W) => !f.nodes.has(W))) {
        k.push(a);
        continue;
      }
      const r = a.pts.map(J), l = E(r[0], r[1], a.pts), F = E(r[2], r[3], a.pts).map((W) => 1 - W), v = E(r[1], r[2], a.pts), u = E(r[3], r[0], a.pts).map((W) => 1 - W);
      let $ = [
        0,
        ...B(l, F),
        1
      ], I = [
        0,
        ...B(v, u),
        1
      ];
      if ($.length === 2 && I.length === 2) {
        k.push(a);
        continue;
      }
      const j = (W, X) => [
        0,
        1,
        2
      ].map((q) => (1 - W) * (1 - X) * r[0][q] + W * (1 - X) * r[1][q] + W * X * r[2][q] + (1 - W) * X * r[3][q]);
      let N = I.map((W) => $.map((X) => D(j(X, W))));
      if (N.some((W) => W.some((X) => X === void 0)) && ($.length >= I.length ? I = [
        0,
        1
      ] : $ = [
        0,
        1
      ], N = I.map((W) => $.map((X) => D(j(X, W)))), N.some((W) => W.some((X) => X === void 0)))) {
        k.push(a);
        continue;
      }
      let Z = true;
      for (let W = 0; W < I.length - 1; W++) for (let X = 0; X < $.length - 1; X++) {
        const q = [
          N[W][X],
          N[W][X + 1],
          N[W + 1][X + 1],
          N[W + 1][X]
        ], G = Z ? a.id : U++;
        Z || o(a.id, G), Z = false, k.push({
          id: G,
          pts: q,
          t: a.t,
          E: a.E,
          rho: a.rho
        });
      }
    }
    f.shells = k;
    const T = 9.80665, e = (a, r) => {
      const l = f.loads.get(a) ?? [
        0,
        0,
        0,
        0,
        0,
        0
      ];
      f.loads.set(a, [
        l[0] + r[0],
        l[1] + r[1],
        l[2] + r[2],
        l[3] + r[3],
        l[4] + r[4],
        l[5] + r[5]
      ]);
    }, n = (a, r) => {
      const l = V(r, a), F = K(l), v = ie(l, 1 / F);
      return f.frames.filter((u) => [
        u.nI,
        u.nJ
      ].every(($) => {
        const I = f.nodes.get($);
        if (!I) return false;
        const j = V(I, a), N = fe(j, v);
        return N > -1e-4 && N < F + 1e-4 && K(V(j, ie(v, N))) < 1e-4;
      }));
    };
    for (const a of f.shells) {
      if (!Xe(f, a.id) || a.pts.length !== 4) continue;
      const r = f.selfWeight ? (a.rho ?? 2.45) * a.t * T * f.selfWeight : 0, l = f.shellLoads.get(a.id) ?? 0, F = -r + l;
      if (Math.abs(F) < 1e-15) continue;
      const v = a.pts.map(J);
      let u;
      if (f.deckOneWay) {
        const I = V(v[1], v[0]);
        let j = Fe(I, V(v[3], v[0]));
        j = ie(j, 1 / K(j));
        const N = ie(I, 1 / K(I)), Z = Fe(j, N), W = (f.shellAngles.get(a.id) ?? 0) * Math.PI / 180;
        u = [
          0,
          1,
          2
        ].map((X) => Math.cos(W) * N[X] + Math.sin(W) * Z[X]);
      }
      const $ = ts(v, 200, u);
      for (let I = 0; I < 4; I++) {
        const { pts: j, dA: N } = $[I];
        if (!j.length) continue;
        const Z = v[I], W = v[(I + 1) % 4], X = n(Z, W);
        if (!X.length) {
          const R = F * N * j.length;
          e(a.pts[I], [
            0,
            0,
            R / 2,
            0,
            0,
            0
          ]), e(a.pts[(I + 1) % 4], [
            0,
            0,
            R / 2,
            0,
            0,
            0
          ]);
          continue;
        }
        const q = V(W, Z), G = K(q), se = ie(q, 1 / G), ne = j.map((R) => fe(V(R, Z), se));
        for (const R of X) {
          const pe = J(R.nI), ce = J(R.nJ), te = fe(V(pe, Z), se), be = fe(V(ce, Z), se), Me = Math.min(te, be), le = Math.max(te, be), Q = le - Me;
          if (Q < 1e-9) continue;
          const Ce = le >= G - 1e-6, oe = ie(V(ce, pe), 1 / Q), ee = Fe(oe, [
            0,
            0,
            1
          ]);
          let he = 0, re = 0, Ie = 0, ue = 0;
          for (const de of ne) {
            if (de < Me - 1e-9 || (Ce ? de > le + 1e-9 : de >= le - 1e-9)) continue;
            let we = de - Me;
            te > be && (we = Q - we);
            const Y = we / Q;
            he += 1 - 3 * Y * Y + 2 * Y * Y * Y, re += Q * (Y - 2 * Y * Y + Y * Y * Y), Ie += 3 * Y * Y - 2 * Y * Y * Y, ue += Q * (-Y * Y + Y * Y * Y);
          }
          const ae = F * N;
          e(R.nI, [
            0,
            0,
            ae * he,
            ee[0] * ae * re,
            ee[1] * ae * re,
            ee[2] * ae * re
          ]), e(R.nJ, [
            0,
            0,
            ae * Ie,
            ee[0] * ae * ue,
            ee[1] * ae * ue,
            ee[2] * ae * ue
          ]);
        }
      }
      f.deckTributario.add(a.id), f.shellLoads.delete(a.id);
    }
  }
  ds = {
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
    runModal(f, t, J) {
      var _a;
      const c = t.nodes.val, E = t.elements.val;
      if (!(!c.length || !E.length)) try {
        const B = Math.max(1, parseInt(window.__hekatanCliModalModes ?? "12", 10) || 12), D = t.nodeInputs.val, U = window.__hekatanCliSprings, k = He(c, E, D, t.elementInputs.val, B, 0, 0, 1, (D == null ? void 0 : D.diaphragms) instanceof Map && D.diaphragms.size ? D.diaphragms : void 0, U && U.length ? U : void 0);
        console.log(`[CLI Modeler] Modal OK \u2014 ${k.frequencies.length} modos, T1 = ${k.frequencies[0] ? (1 / k.frequencies[0]).toFixed(5) : "\u2014"} s`), (_a = J == null ? void 0 : J.render) == null ? void 0 : _a.call(J, k, {
          title: "Modal del .heks (masa 3D, como SAP2000)"
        });
      } catch (B) {
        console.error("[CLI Modeler] modal:", (B == null ? void 0 : B.message) ?? B);
      }
    },
    build(f, t) {
      var _a, _b;
      const J = window.__hekatanCliScript ?? ss;
      window.__hekatanCliLastScript = J;
      const c = es(J);
      c.autoMesh > 0 && os(c, c.autoMesh), c.deckEtabs && ns(c);
      const E = /* @__PURE__ */ new Map(), B = /* @__PURE__ */ new Map(), D = [], U = Array.from(c.nodes.keys()).sort((s, d) => s - d);
      for (const s of U) E.set(s, D.length), D.push(c.nodes.get(s));
      const k = [], o = /* @__PURE__ */ new Map(), T = /* @__PURE__ */ new Map(), e = /* @__PURE__ */ new Map(), n = /* @__PURE__ */ new Map(), a = /* @__PURE__ */ new Map(), r = /* @__PURE__ */ new Map(), l = /* @__PURE__ */ new Map(), F = /* @__PURE__ */ new Map(), v = /* @__PURE__ */ new Map(), u = /* @__PURE__ */ new Map(), $ = /* @__PURE__ */ new Map(), I = /* @__PURE__ */ new Map(), j = /* @__PURE__ */ new Map(), N = /* @__PURE__ */ new Map(), Z = /* @__PURE__ */ new Map(), W = /* @__PURE__ */ new Map(), X = /* @__PURE__ */ new Map(), q = /* @__PURE__ */ new Map(), G = /* @__PURE__ */ new Map(), se = /* @__PURE__ */ new Map();
      for (const s of c.frames) {
        const d = E.get(s.nI), w = E.get(s.nJ);
        if (d === void 0 || w === void 0) {
          const M = U.length ? `IDs disponibles: ${U.join(", ")}` : "ning\xFAn nodo definido", A = [];
          d === void 0 && A.push(s.nI), w === void 0 && A.push(s.nJ), c.errors.push(`frame ${s.id}: nodo(s) inexistente(s) [${A.join(", ")}] \u2014 ${M}`);
          continue;
        }
        const i = k.length;
        k.push([
          d,
          w
        ]);
        const p = s.nu ?? 0.2;
        o.set(i, s.E), T.set(i, s.E / (2 * (1 + p))), e.set(i, s.A), n.set(i, s.I), a.set(i, s.Iy ?? s.I), r.set(i, s.J ?? 0.14 * Math.pow(Math.sqrt(s.A), 4)), l.set(i, s.rho ?? 2.45), G.set(i, p), s.D !== void 0 && isFinite(s.D) && F.set(i, s.D), s.B !== void 0 && isFinite(s.B) && v.set(i, s.B);
        const m = c.frameAngles.get(s.id);
        m !== void 0 && isFinite(m) && $.set(i, m);
        const b = c.frameReleases.get(s.id);
        b && I.set(i, b);
        const h = c.frameEndOffsets.get(s.id);
        h && j.set(i, h);
        const C = c.frameLoads.get(s.id);
        C && W.set(i, C);
        const z = c.frameShearAreas.get(s.id);
        if (z && (q.set(i, z[0]), X.set(i, z[1])), s.sec || s.D !== void 0 && s.B !== void 0) {
          const M = {
            type: "general"
          };
          s.sec && (M.name = s.sec), s.D !== void 0 && isFinite(s.D) && (M.h = s.D), s.B !== void 0 && isFinite(s.B) && (M.b = s.B), u.set(i, M);
        }
        const g = c.frameISec.get(s.id);
        if (g) {
          const M = _e(g.d, g.bf, g.tf, g.tw, g.t2b, g.tfb);
          e.set(i, M.A), a.set(i, M.Iz), n.set(i, M.Iy), r.set(i, M.J), q.set(i, M.As2), X.set(i, M.As3), F.set(i, g.d), v.set(i, Math.max(g.bf, g.t2b));
          const A = (_) => Math.round(_ * 1e4) / 10;
          u.set(i, {
            type: "I",
            h: g.d,
            b: g.bf,
            tf: g.tf,
            tw: g.tw,
            t2b: g.t2b,
            tfb: g.tfb,
            name: s.sec ?? `I${A(g.d)}X${A(g.bf)}X${A(g.tf)}X${A(g.tw)}`
          });
        }
        const x = c.frameTube.get(s.id);
        if (x) {
          const M = Pe(x.b, x.h, x.tf, x.tw);
          e.set(i, M.A), a.set(i, M.Iz), n.set(i, M.Iy), r.set(i, M.J), q.set(i, M.As2), X.set(i, M.As3), F.set(i, x.h), v.set(i, x.b);
          const A = (_) => Math.round(_ * 1e4) / 10;
          u.set(i, {
            type: "HSS",
            h: x.h,
            b: x.b,
            tf: x.tf,
            tw: x.tw,
            name: s.sec ?? `TUBO${A(x.h)}X${A(x.b)}X${A(x.tf)}X${A(x.tw)}`
          });
        }
        const y = c.frameCanal.get(s.id);
        if (y) {
          const M = qe(y.d, y.bf, y.tf, y.tw);
          e.set(i, M.A), a.set(i, M.Iz), n.set(i, M.Iy), r.set(i, M.J), q.set(i, M.As2), X.set(i, M.As3), F.set(i, y.d), v.set(i, y.bf);
          const A = (_) => Math.round(_ * 1e4) / 10;
          u.set(i, {
            type: "C",
            h: y.d,
            b: y.bf,
            tf: y.tf,
            tw: y.tw,
            name: s.sec ?? `C${A(y.d)}X${A(y.bf)}X${A(y.tf)}X${A(y.tw)}`
          });
        }
        const O = c.frameDosL.get(s.id);
        if (O) {
          const M = Be(O.d, O.t2, O.tf, O.tw, O.dis);
          e.set(i, M.A), a.set(i, M.Iz), n.set(i, M.Iy), r.set(i, M.J), q.set(i, M.As2), X.set(i, M.As3), F.set(i, O.d), v.set(i, O.t2);
          const A = (_) => Math.round(_ * 1e4) / 10;
          u.set(i, {
            type: "2L",
            h: O.d,
            b: O.t2,
            tf: O.tf,
            tw: O.tw,
            dis: O.dis,
            name: s.sec ?? `2L${A(O.d)}X${A(O.t2)}X${A(O.tf)}X${A(O.tw)}S${A(O.dis)}`
          });
        }
        const L = c.frameCftc.get(s.id);
        if (L) {
          const M = Ue(L.D, L.t, s.E, p, L.Ec, L.nuC);
          e.set(i, M.A), a.set(i, M.Iz), n.set(i, M.Iy), r.set(i, M.J), q.set(i, M.As2), X.set(i, M.As3), F.set(i, L.D), v.set(i, L.D);
          const A = L.D - 2 * L.t, _ = Math.PI * A * A / 4, P = Math.PI * L.D * L.D / 4 - _;
          l.set(i, ((s.rho ?? 7.85) * P + L.rhoC * _) / M.A), u.set(i, {
            type: "CFT",
            d: L.D,
            tw: L.t,
            fillE: L.Ec,
            fillRho: L.rhoC,
            steelRho: s.rho ?? 7.85,
            name: s.sec ?? `CFTC ${Math.round(L.D * 1e3)}X${Math.round(L.t * 1e3)}`
          });
        }
        const S = c.frameCft.get(s.id);
        if (S) {
          const M = Ge(S.b, S.h, S.t, s.E, p, S.Ec, S.nuC, S.tw);
          e.set(i, M.A), a.set(i, M.Iz), n.set(i, M.Iy), r.set(i, M.J), q.set(i, M.As2), X.set(i, M.As3), F.set(i, S.h), v.set(i, S.b);
          const A = (S.b - 2 * S.tw) * (S.h - 2 * S.t), _ = S.b * S.h - A;
          l.set(i, ((s.rho ?? 7.85) * _ + S.rhoC * A) / M.A);
          const P = (H) => Math.round(H * 1e3);
          u.set(i, {
            type: "CFT",
            b: S.b,
            h: S.h,
            tw: S.tw,
            tf: S.t,
            fillE: S.Ec,
            fillRho: S.rhoC,
            steelRho: s.rho ?? 7.85,
            name: s.sec ?? `CFT ${P(S.h)}X${P(S.b)}X${P(S.t)}${S.tw !== S.t ? `X${P(S.tw)}` : ""}`
          });
        }
      }
      if (c.meshCross) {
        const s = (b, h) => b[0] * h[0] + b[1] * h[1] + b[2] * h[2], d = [
          o,
          T,
          e,
          n,
          a,
          r,
          l,
          G,
          F,
          v,
          $,
          X,
          q,
          u,
          W
        ], w = (b, h) => {
          for (const C of d) C.has(b) && C.set(h, C.get(b));
        }, i = (b) => {
          for (let h = 0; h < D.length; h++) if (Math.hypot(D[h][0] - b[0], D[h][1] - b[1], D[h][2] - b[2]) < 1e-6) return h;
          return D.push([
            b[0],
            b[1],
            b[2]
          ]), D.length - 1;
        }, p = (b) => {
          const h = D[b[0]], C = D[b[1]];
          return [
            Math.min(h[0], C[0]),
            Math.min(h[1], C[1]),
            Math.min(h[2], C[2]),
            Math.max(h[0], C[0]),
            Math.max(h[1], C[1]),
            Math.max(h[2], C[2])
          ];
        };
        let m = 0;
        for (let b = 0; b < k.length; b++) {
          if (k[b].length !== 2) continue;
          const h = p(k[b]);
          for (let C = b + 1; C < k.length; C++) {
            if (k[C].length !== 2) continue;
            const [z, g] = k[b], [x, y] = k[C];
            if (z === x || z === y || g === x || g === y) continue;
            const O = p(k[C]);
            if (h[0] > O[3] + 1e-6 || O[0] > h[3] + 1e-6 || h[1] > O[4] + 1e-6 || O[1] > h[4] + 1e-6 || h[2] > O[5] + 1e-6 || O[2] > h[5] + 1e-6) continue;
            const L = D[z], S = D[g], M = D[x], A = D[y], _ = [
              S[0] - L[0],
              S[1] - L[1],
              S[2] - L[2]
            ], P = [
              A[0] - M[0],
              A[1] - M[1],
              A[2] - M[2]
            ], H = [
              L[0] - M[0],
              L[1] - M[1],
              L[2] - M[2]
            ], me = s(_, _), Le = s(_, P), $e = s(P, P), ze = s(_, H), Te = s(P, H), Ae = me * $e - Le * Le;
            if (Ae < 1e-10 * me * $e) continue;
            const ve = (Le * Te - $e * ze) / Ae, ke = (me * Te - Le * ze) / Ae;
            if (ve < 1e-6 || ve > 1 - 1e-6 || ke < 1e-6 || ke > 1 - 1e-6) continue;
            const ye = [
              L[0] + ve * _[0],
              L[1] + ve * _[1],
              L[2] + ve * _[2]
            ], Ee = [
              M[0] + ke * P[0],
              M[1] + ke * P[1],
              M[2] + ke * P[2]
            ];
            if (Math.hypot(ye[0] - Ee[0], ye[1] - Ee[1], ye[2] - Ee[2]) > 1e-6) continue;
            const Je = i(ye);
            for (const ge of [
              b,
              C
            ]) {
              const [Ne, Re] = k[ge], Se = k.length;
              k[ge] = [
                Ne,
                Je
              ], k.push([
                Je,
                Re
              ]), w(ge, Se);
              const De = I.get(ge);
              De && (I.set(ge, [
                ...De.slice(0, 6),
                ...Array(6).fill(false)
              ]), I.set(Se, [
                ...Array(6).fill(false),
                ...De.slice(6)
              ]));
              const xe = j.get(ge);
              xe && (j.set(ge, [
                xe[0],
                0,
                xe[2]
              ]), j.set(Se, [
                0,
                xe[1],
                xe[2]
              ]));
            }
            m++;
          }
        }
        m > 0 && console.log(`[CLI Modeler] ${m} cruces de barras partidos con nudo (como ETABS; meshcross 0 lo apaga)`);
      }
      for (const s of c.shells) {
        const d = s.pts.map((m) => E.get(m));
        if (d.some((m) => m === void 0)) {
          c.errors.push(`shell ${s.id}: algun nodo inexistente`);
          continue;
        }
        const w = k.length;
        B.set(s.id, w), k.push(d), o.set(w, s.E), T.set(w, s.E / (2 * 1.2)), se.set(w, s.t), l.set(w, s.rho ?? 2.45), G.set(w, 0.2);
        const i = c.shellTypes.get(s.id);
        i !== void 0 && N.set(w, i);
        const p = c.deckSecs.get(s.id);
        if (p) {
          const m = p.tc + (p.sr > 0 ? p.hr * (p.wrt + p.wrb) / 2 / p.sr : 0);
          se.set(w, p.tc), l.set(w, ((s.rho ?? 2.45) * m + p.w / 9.80665) / p.tc), Z.set(w, {
            ...p
          });
        }
      }
      const ne = /* @__PURE__ */ new Map();
      for (const [s, d] of c.supports.entries()) {
        const w = E.get(s);
        w !== void 0 && ne.set(w, d);
      }
      const R = /* @__PURE__ */ new Map();
      for (const [s, d] of c.loads.entries()) {
        const w = E.get(s);
        w !== void 0 && R.set(w, [
          ...d
        ]);
      }
      const pe = /* @__PURE__ */ new Map();
      for (const [s, d] of c.diaphragms.entries()) {
        const w = E.get(s);
        w !== void 0 && pe.set(w, d);
      }
      const ce = /* @__PURE__ */ new Map();
      for (const [s, d] of c.masses.entries()) {
        const w = E.get(s);
        w !== void 0 && ce.set(w, d);
      }
      const te = /* @__PURE__ */ new Map();
      for (const [s, d] of c.loadsPat) {
        const w = /* @__PURE__ */ new Map();
        for (const [i, p] of d) {
          const m = E.get(i);
          m !== void 0 && w.set(m, [
            ...p
          ]);
        }
        te.set(s, w);
      }
      const be = {
        Dead: new Map([
          ...R
        ].map(([s, d]) => [
          s,
          [
            ...d
          ]
        ]))
      };
      for (const [s, d] of te) be[s] = new Map([
        ...d
      ].map(([w, i]) => [
        w,
        [
          ...i
        ]
      ]));
      const Me = [
        [
          c.frameLoads,
          R
        ]
      ];
      for (const [s, d] of c.frameLoadsPat) te.has(s) || te.set(s, /* @__PURE__ */ new Map()), Me.push([
        d,
        te.get(s)
      ]);
      for (const [s, d] of Me) if (s.size) {
        const w = (i, p) => {
          const m = d.get(i) ?? [
            0,
            0,
            0,
            0,
            0,
            0
          ];
          d.set(i, [
            m[0] + p[0],
            m[1] + p[1],
            m[2] + p[2],
            m[3] + p[3],
            m[4] + p[4],
            m[5] + p[5]
          ]);
        };
        for (const [i, p] of s.entries()) {
          const m = c.frames.find((S) => S.id === i);
          if (!m) {
            c.errors.push(`frameload ${i}: no existe esa barra`);
            continue;
          }
          const b = E.get(m.nI), h = E.get(m.nJ);
          if (b === void 0 || h === void 0) continue;
          const C = D[b], z = D[h], g = [
            z[0] - C[0],
            z[1] - C[1],
            z[2] - C[2]
          ], x = Math.hypot(g[0], g[1], g[2]);
          if (x < 1e-9) continue;
          const y = [
            g[0] / x,
            g[1] / x,
            g[2] / x
          ], O = x * x / 12, L = [
            y[1] * p[2] - y[2] * p[1],
            y[2] * p[0] - y[0] * p[2],
            y[0] * p[1] - y[1] * p[0]
          ];
          w(b, [
            p[0] * x / 2,
            p[1] * x / 2,
            p[2] * x / 2,
            O * L[0],
            O * L[1],
            O * L[2]
          ]), w(h, [
            p[0] * x / 2,
            p[1] * x / 2,
            p[2] * x / 2,
            -O * L[0],
            -O * L[1],
            -O * L[2]
          ]);
        }
      }
      const le = /* @__PURE__ */ new Map(), Q = 1 / Math.sqrt(3), Ce = [
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
        const w = s.pts.map((m) => E.get(m));
        if (w.some((m) => m === void 0)) {
          c.errors.push(`areaload ${s.id}: algun nodo inexistente`);
          continue;
        }
        const i = w.map((m) => D[m]), p = [
          0,
          0,
          0,
          0
        ];
        for (const [m, b] of Ce) {
          const h = [
            0.25 * (1 - m) * (1 - b),
            0.25 * (1 + m) * (1 - b),
            0.25 * (1 + m) * (1 + b),
            0.25 * (1 - m) * (1 + b)
          ], C = [
            -0.25 * (1 - b),
            0.25 * (1 - b),
            0.25 * (1 + b),
            -0.25 * (1 + b)
          ], z = [
            -0.25 * (1 - m),
            -0.25 * (1 + m),
            0.25 * (1 + m),
            0.25 * (1 - m)
          ], g = [
            0,
            1,
            2
          ].map((L) => C.reduce((S, M, A) => S + M * i[A][L], 0)), x = [
            0,
            1,
            2
          ].map((L) => z.reduce((S, M, A) => S + M * i[A][L], 0)), y = [
            g[1] * x[2] - g[2] * x[1],
            g[2] * x[0] - g[0] * x[2],
            g[0] * x[1] - g[1] * x[0]
          ], O = Math.hypot(y[0], y[1], y[2]);
          for (let L = 0; L < 4; L++) p[L] += h[L] * d * O;
        }
        for (let m = 0; m < 4; m++) {
          const b = w[m], h = R.get(b) ?? [
            0,
            0,
            0,
            0,
            0,
            0
          ];
          h[2] += p[m], R.set(b, h), le.set(b, (le.get(b) ?? 0) + p[m]);
        }
      }
      if (c.selfWeight) {
        const d = /* @__PURE__ */ new Set();
        for (const [i, p] of B) c.deckTributario.has(i) && d.add(p);
        const w = (i, p) => {
          const m = R.get(i) ?? [
            0,
            0,
            0,
            0,
            0,
            0
          ];
          m[2] += p, R.set(i, m);
        };
        k.forEach((i, p) => {
          const m = l.get(p) ?? 0;
          if (m && !d.has(p)) {
            if (i.length === 2) {
              const b = e.get(p) ?? 0, h = D[i[0]], C = D[i[1]], z = [
                C[0] - h[0],
                C[1] - h[1],
                C[2] - h[2]
              ];
              let g = Math.hypot(z[0], z[1], z[2]);
              const x = j.get(p);
              if (x) {
                const _ = Math.hypot(z[0], z[1]);
                _ > 1e-9 && Math.abs(Math.atan2(Math.abs(z[2]), _)) * 180 / Math.PI < 20 && (g = Math.max(g - x[0] - x[1], 0));
              }
              const y = Math.hypot(z[0], z[1], z[2]), O = -b * m * 9.80665 * c.selfWeight, L = [
                z[0] / y,
                z[1] / y,
                z[2] / y
              ], S = g * g / 12, M = [
                L[1] * O,
                -L[0] * O,
                0
              ], A = (_, P) => {
                const H = R.get(_) ?? [
                  0,
                  0,
                  0,
                  0,
                  0,
                  0
                ];
                R.set(_, [
                  H[0] + P[0],
                  H[1] + P[1],
                  H[2] + P[2],
                  H[3] + P[3],
                  H[4] + P[4],
                  H[5] + P[5]
                ]);
              };
              A(i[0], [
                0,
                0,
                O * g / 2,
                S * M[0],
                S * M[1],
                0
              ]), A(i[1], [
                0,
                0,
                O * g / 2,
                -S * M[0],
                -S * M[1],
                0
              ]);
            } else if (i.length === 4) {
              const b = se.get(p) ?? 0, h = i.map((g) => D[g]);
              let C = 0;
              for (let g = 1; g < 3; g++) {
                const x = [
                  h[g][0] - h[0][0],
                  h[g][1] - h[0][1],
                  h[g][2] - h[0][2]
                ], y = [
                  h[g + 1][0] - h[0][0],
                  h[g + 1][1] - h[0][1],
                  h[g + 1][2] - h[0][2]
                ], O = [
                  x[1] * y[2] - x[2] * y[1],
                  x[2] * y[0] - x[0] * y[2],
                  x[0] * y[1] - x[1] * y[0]
                ];
                C += Math.hypot(O[0], O[1], O[2]) / 2;
              }
              const z = C * b * m * 9.80665 * c.selfWeight;
              for (const g of i) w(g, -z / 4);
            }
          }
        });
      }
      const oe = [];
      for (const s of c.springs) {
        const d = E.get(s.node);
        d !== void 0 && oe.push({
          node: d,
          dof: s.dof,
          k: s.k
        });
      }
      for (const s of c.areaSprings) {
        const d = B.get(s.id);
        if (d === void 0) {
          c.errors.push(`areaspring ${s.id}: no existe esa cascara`);
          continue;
        }
        oe.push({
          node: -(d + 1),
          dof: s.nodal ? -3 : -1,
          k: s.ks
        });
      }
      if (c.edgeEtabs) {
        const s = c.edgeLineal, d = s ? 1e-4 : 1e-6, w = /* @__PURE__ */ new Set(), i = [];
        k.forEach((m, b) => {
          if (m.length === 3 || m.length === 4) {
            i.push(b);
            for (const h of m) w.add(h);
          }
        });
        let p = 0;
        for (const m of i) {
          const b = k[m], h = b.map((z) => D[z]), C = [
            0,
            1,
            2
          ].map((z) => [
            Math.min(...h.map((g) => g[z])),
            Math.max(...h.map((g) => g[z]))
          ]);
          for (let z = 0; z < D.length; z++) {
            if (b.includes(z)) continue;
            const g = D[z], x = s ? d * Math.max(C[0][1] - C[0][0], C[1][1] - C[1][0], C[2][1] - C[2][0]) : 1e-6;
            if (g[0] < C[0][0] - x || g[0] > C[0][1] + x || g[1] < C[1][0] - x || g[1] > C[1][1] + x || g[2] < C[2][0] - x || g[2] > C[2][1] + x) continue;
            let y = false;
            for (let L = 0; L < b.length && !y; L++) {
              const S = h[L], M = h[(L + 1) % b.length], A = [
                M[0] - S[0],
                M[1] - S[1],
                M[2] - S[2]
              ], _ = A[0] * A[0] + A[1] * A[1] + A[2] * A[2];
              if (_ < 1e-24) continue;
              const P = [
                g[0] - S[0],
                g[1] - S[1],
                g[2] - S[2]
              ], H = (P[0] * A[0] + P[1] * A[1] + P[2] * A[2]) / _;
              if (H <= 1e-6 || H >= 1 - 1e-6) continue;
              const me = [
                P[0] - H * A[0],
                P[1] - H * A[1],
                P[2] - H * A[2]
              ];
              Math.hypot(me[0], me[1], me[2]) <= d * Math.sqrt(_) && (y = true);
            }
            !y || !(s || k.some((L, S) => S !== m && L.includes(z))) || (oe.push({
              node: -(m + 1),
              dof: s ? -4 : -2,
              k: z
            }), p++);
          }
        }
        p && console.log(`[CLI Modeler] edge ${s ? "lineal" : "etabs"}: ${p} nudo(s) colgado(s) atado(s) a su arista (${s ? "lineal" : "Hermite"})`);
      }
      const ee = [];
      for (const s of c.solids) {
        const d = s.pts.map((i) => E.get(i));
        if (d.some((i) => i === void 0)) {
          c.errors.push(`hex ${s.id}: algun nodo inexistente`);
          continue;
        }
        const w = k.length;
        if (k.push(d), o.set(w, s.E), G.set(w, s.nu), T.set(w, s.E / (2 * (1 + s.nu))), l.set(w, s.rho), ee.push(w), c.selfWeight && s.rho) {
          const i = d.map((h) => D[h]), p = (h, C, z, g) => {
            const x = [
              0,
              1,
              2
            ].map((L) => i[C][L] - i[h][L]), y = [
              0,
              1,
              2
            ].map((L) => i[z][L] - i[h][L]), O = [
              0,
              1,
              2
            ].map((L) => i[g][L] - i[h][L]);
            return Math.abs(x[0] * (y[1] * O[2] - y[2] * O[1]) - x[1] * (y[0] * O[2] - y[2] * O[0]) + x[2] * (y[0] * O[1] - y[1] * O[0])) / 6;
          }, b = (p(0, 1, 2, 6) + p(0, 2, 3, 6) + p(0, 3, 7, 6) + p(0, 7, 4, 6) + p(0, 4, 5, 6) + p(0, 5, 1, 6)) * s.rho * 9.80665 * c.selfWeight;
          for (const h of d) {
            const C = R.get(h) ?? [
              0,
              0,
              0,
              0,
              0,
              0
            ];
            C[2] -= b / 8, R.set(h, C);
          }
        }
      }
      t.nodes.val = D, t.elements.val = k, t.nodeInputs.val = {
        supports: ne,
        loads: R,
        masses: ce,
        diaphragms: pe,
        cargasPorPatron: be,
        springs: oe
      }, t.springs && (t.springs.val = oe);
      const he = /* @__PURE__ */ new Map(), re = /* @__PURE__ */ new Map(), Ie = /* @__PURE__ */ new Map(), ue = /* @__PURE__ */ new Map(), ae = /* @__PURE__ */ new Map();
      for (const s of c.shells) {
        const d = B.get(s.id);
        if (d === void 0) continue;
        const w = c.shellLoads.get(s.id);
        w !== void 0 && ue.set(d, w);
        const i = c.shellAngles.get(s.id);
        i !== void 0 && ae.set(d, i);
        const p = c.shellModsDir.get(s.id);
        if (p) {
          Ie.set(d, p), he.set(d, (p[0] + p[1]) / 2), re.set(d, (p[3] + p[4]) / 2);
          continue;
        }
        const m = c.shellMods.get(s.id);
        m ? (he.set(d, m[0]), re.set(d, m[1])) : c.deckSecs.has(s.id) && (he.set(d, 1), re.set(d, 0));
      }
      if (t.elementInputs.val = {
        elasticities: o,
        shearModuli: T,
        areas: e,
        momentsOfInertiaY: n,
        momentsOfInertiaZ: a,
        torsionalConstants: c.torsionFactor !== 1 ? new Map([
          ...r
        ].map(([s, d]) => [
          s,
          d * c.torsionFactor
        ])) : r,
        densities: l,
        poissonsRatios: G,
        thicknesses: se,
        membraneModifiers: he,
        bendingModifiers: re,
        shellModifiers: Ie,
        shellSurfaceLoads: ue,
        shellAngles: ae,
        cargaDeArea: le,
        cantos: F,
        anchos: v,
        sectionShapes: u,
        localAngles: $,
        shearAreasY: X,
        shearAreasZ: q,
        momentReleases: I,
        endOffsets: j,
        plateFormulations: N,
        deckSections: Z,
        frameLoads: W,
        frameLoadsPorPatron: (() => {
          const s = {
            Dead: W
          }, d = /* @__PURE__ */ new Map();
          k.forEach((w, i) => {
            if (w.length === 2) {
              const p = c.frames.find((m) => E.get(m.nI) === w[0] && E.get(m.nJ) === w[1]);
              p && d.set(p.id, i);
            }
          });
          for (const [w, i] of c.frameLoadsPat) {
            const p = /* @__PURE__ */ new Map();
            for (const [m, b] of i) {
              const h = d.get(m);
              h !== void 0 && p.set(h, b);
            }
            s[w] = p;
          }
          return s;
        })(),
        combos: c.combos,
        fcExport: c.fc,
        areaSpringsExport: new Map(c.areaSprings.map((s) => [
          B.get(s.id),
          {
            ks: s.ks,
            nodal: s.nodal,
            comp: !!s.comp
          }
        ]).filter(([s]) => s !== void 0)),
        meshAtIntersections: c.meshCross,
        solidIncompatible: c.solidIncompatible,
        selfWeight: c.selfWeight,
        etabsWallJoint: c.etabsWallJoint,
        areaObjects: c.areaObjs.map((s) => ({
          nodes: s.pts.map((d) => E.get(d)).filter((d) => d !== void 0),
          cells: s.cells.map((d) => B.get(d)).filter((d) => d !== void 0),
          q: s.cells.map((d) => c.shellLoads.get(d)).find((d) => d !== void 0),
          ang: s.cells.map((d) => c.shellAngles.get(d)).find((d) => d !== void 0)
        })).filter((s) => s.nodes.length === 4 && s.cells.length > 0)
      }, c.doSolve && ee.length > 0 && ee.length === k.length && oe.length === 0) try {
        const s = o.get(ee[0]) ?? 25e6, d = G.get(ee[0]) ?? 0.2;
        ee.some((b) => Math.abs((o.get(b) ?? s) - s) > 1e-9 * s || Math.abs((G.get(b) ?? d) - d) > 1e-12) && c.errors.push("hex: hex8Solve lleva UN material; los solidos tienen E o nu distintos y se usa el del primero");
        const w = /* @__PURE__ */ new Map();
        for (const [b, h] of t.nodeInputs.val.supports ?? []) w.set(b, [
          !!h[0],
          !!h[1],
          !!h[2]
        ]);
        const i = /* @__PURE__ */ new Map();
        for (const [b, h] of We({
          Dead: R,
          ...Object.fromEntries(te)
        })) i.set(b, [
          h[0] ?? 0,
          h[1] ?? 0,
          h[2] ?? 0
        ]);
        const p = Ye({
          nodes: D,
          elements: k,
          E: s,
          nu: d,
          supports: w,
          loads: i,
          incompatible: c.solidIncompatible
        }), m = /* @__PURE__ */ new Map();
        p.displacements.forEach(([b, h, C], z) => m.set(z, [
          b,
          h,
          C,
          0,
          0,
          0
        ])), t.deformOutputs.val = {
          deformations: m,
          reactions: /* @__PURE__ */ new Map()
        }, t.analyzeOutputs.val = {
          solidStress: p.stressPerElement,
          solidVonMises: p.vonMisesPerElement
        }, console.log(`[CLI Modeler] Solve OK \u2014 ${k.length} solidos H8, ${D.length} nodos (${p.elapsedMs.toFixed(0)} ms)`);
      } catch (s) {
        c.errors.push(`hex8Solve: ${(s == null ? void 0 : s.message) ?? s}`);
      }
      else if (c.doSolve && D.length && k.length) try {
        window.__hekatanCliSprings = oe;
        const s = We({
          Dead: R,
          ...Object.fromEntries(te)
        });
        t.deformOutputs.val = Ke(D, k, {
          ...t.nodeInputs.val,
          loads: s
        }, t.elementInputs.val, oe.length ? oe : void 0);
        try {
          t.analyzeOutputs.val = Ze(D, k, t.elementInputs.val, t.deformOutputs.val);
        } catch (d) {
          console.warn("[CLI Modeler] analyze:", (d == null ? void 0 : d.message) ?? d);
        }
        if (c.areaSprings.length > 0) try {
          const d = t.deformOutputs.val.deformations, w = t.analyzeOutputs.val ?? {}, i = w.pressure instanceof Map ? w.pressure : /* @__PURE__ */ new Map();
          let p = 0, m = 0;
          for (const b of c.areaSprings) {
            const h = B.get(b.id);
            if (h === void 0) continue;
            const z = k[h].map((g) => {
              var _a2;
              const x = ((_a2 = d.get(g)) == null ? void 0 : _a2[2]) ?? 0, y = b.ks * x;
              return y < p && (p = y), y > m && (m = y), y;
            });
            i.set(h, z);
          }
          i.size > 0 && (w.pressure = i, w.colorMapRanges = {
            ...w.colorMapRanges ?? {},
            pressure: [
              m,
              p
            ]
          }, t.analyzeOutputs.val = w, console.log(`[CLI Modeler] presi\xF3n Winkler: ${i.size} shells, \u03C3 ${p.toFixed(0)}..${m.toFixed(0)} kN/m\xB2`));
        } catch (d) {
          console.warn("[CLI Modeler] presi\xF3n:", (d == null ? void 0 : d.message) ?? d);
        }
        if (ee.length > 0) try {
          const d = t.deformOutputs.val.deformations, w = /* @__PURE__ */ new Map(), i = /* @__PURE__ */ new Map();
          for (const p of ee) {
            const m = k[p], b = m.map((z) => D[z]), h = m.flatMap((z) => {
              const g = d.get(z) ?? [
                0,
                0,
                0
              ];
              return [
                g[0],
                g[1],
                g[2]
              ];
            }), C = Ve(b, o.get(p) ?? 25e6, G.get(p) ?? 0.2, h, c.solidIncompatible);
            w.set(p, C.stress), i.set(p, C.vonMises);
          }
          t.analyzeOutputs.val = {
            ...t.analyzeOutputs.val ?? {},
            solidStress: w,
            solidVonMises: i
          };
        } catch (d) {
          console.warn("[CLI Modeler] tensiones de solidos:", (d == null ? void 0 : d.message) ?? d);
        }
        console.log("[CLI Modeler] Solve OK \u2014", k.length, "elementos,", D.length, "nodos");
      } catch (s) {
        c.errors.push(`solve fall\xF3: ${s.message}`);
      }
      if (t.objects3D.val = [], c.errors.length) {
        console.warn("[CLI Modeler] Errores:");
        for (const s of c.errors) console.warn("  -", s);
      }
      window.__hekatanCliErrors = c.errors;
      let de = 0, we = 0;
      const Y = t.deformOutputs.val;
      if ((_a = Y == null ? void 0 : Y.deformations) == null ? void 0 : _a.size) for (const [, s] of Y.deformations) Math.abs(s[2]) > Math.abs(de) && (de = s[2]);
      if ((_b = Y == null ? void 0 : Y.reactions) == null ? void 0 : _b.size) for (const [, s] of Y.reactions) we += s[2] || 0;
      window.__hekatanCliVista = c.vista ?? null, window.__hekatanCliStats = {
        nodes: D.length,
        frames: c.frames.length,
        shells: c.shells.length,
        supports: ne.size,
        loads: R.size,
        springs: oe.length,
        solved: c.doSolve,
        errors: c.errors.length,
        maxUzMm: +(de * 1e3).toFixed(3),
        sumRz: +we.toFixed(1)
      };
    }
  };
});
export {
  __tla,
  ds as c,
  es as p
};
