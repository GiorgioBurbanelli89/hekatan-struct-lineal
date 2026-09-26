import { i as Ne, t as qe, c as _e, d as Be, a as Ye, b as Ue } from "./cadSections-BcRFaG1j.js";
import { c as Je } from "./cargasPorCaso-B_GZ_-rO.js";
import { h as Ge, a as Ve, __tla as __tla_0 } from "./h8-NvnnhbYJ.js";
import { a as Ze, __tla as __tla_1 } from "./analyze-ZiWUXQRU.js";
import { m as He, d as Ke, __tla as __tla_2 } from "./didacticCpp-BoYi16rL.js";
let ls, Qe;
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
  const Oe = {
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
  function We(f) {
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
    const X = [
      false,
      false,
      false,
      false,
      false,
      false
    ], c = o.split(/[\s,]+/).filter(Boolean);
    if (c.length > 1 && c.length <= 6 && c.every((S) => S === "0" || S === "1")) return c.forEach((S, B) => {
      X[B] = S === "1";
    }), X;
    for (const S of c) Oe[S] !== void 0 && (X[Oe[S]] = true);
    if (/^[01]+$/.test(o) && o.length <= 6) for (let S = 0; S < o.length; S++) X[S] = o[S] === "1";
    return X;
  }
  Qe = function(f) {
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
    let X = null, c = 0, S = 0, B = 0;
    const O = f.split(/\r?\n/);
    for (let Y = 0; Y < O.length; Y++) {
      let x = O[Y].trim();
      if (!x || x.startsWith("#") || x.startsWith("//")) continue;
      x = x.replace(/[;]+$/, "");
      const t = x.split(/\s+/), T = t[0].toLowerCase();
      if (T === "nodes" && t.length === 1) {
        X = "nodes";
        continue;
      }
      if ((T === "elements" || T === "frames") && t.length === 1) {
        X = "elements";
        continue;
      }
      if (T === "areas" && t.length === 1) {
        X = "areas";
        continue;
      }
      if (T === "supports" && t.length === 1) {
        X = "supports";
        continue;
      }
      if (T === "loads" && t.length === 1) {
        X = "loads";
        continue;
      }
      if (T === "springs" && t.length === 1) {
        X = "springs";
        continue;
      }
      if (X && /^[\-\d]/.test(t[0])) {
        const e = t.map(parseFloat);
        if (X === "nodes" && e.length >= 3) {
          c++, o.nodes.set(c, [
            e[0],
            e[1],
            e[2]
          ]);
          continue;
        }
        if (X === "elements" && e.length >= 2) {
          S++, o.frames.push({
            id: S,
            nI: e[0] + 1,
            nJ: e[1] + 1,
            E: 25e6,
            A: 0.16,
            I: 21e-4
          });
          continue;
        }
        if (X === "areas" && e.length >= 4) {
          B++, o.shells.push({
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
        if (X === "loads" && e.length >= 4) {
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
        if (X === "springs" && e.length >= 3) {
          o.springs.push({
            node: e[0],
            dof: e[1],
            k: e[2]
          });
          continue;
        }
      }
      if (X === "supports" && /^\d/.test(t[0])) {
        const e = parseInt(t[0], 10), n = t.slice(1).join(" ");
        o.supports.set(e, We(n));
        continue;
      }
      X && !/^[\-\d]/.test(t[0]) && (X = null);
      try {
        switch (T) {
          case "node":
          case "n": {
            const e = parseInt(t[1], 10), n = parseFloat(t[2]), a = parseFloat(t[3]), r = parseFloat(t[4]);
            !isFinite(e) || !isFinite(n) || !isFinite(a) || !isFinite(r) ? o.errors.push(`L${Y + 1}: node mal formado: ${x}`) : o.nodes.set(e, [
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
            const e = parseInt(t[1], 10), n = parseInt(t[2], 10), a = parseInt(t[3], 10), r = parseFloat(t[4] ?? "25e6"), l = parseFloat(t[5] ?? "0.16"), F = parseFloat(t[6] ?? "0.001"), I = t[7] !== void 0 ? parseFloat(t[7]) : void 0, u = t[8] !== void 0 ? parseFloat(t[8]) : void 0, $ = t[9] !== void 0 ? parseFloat(t[9]) : void 0, v = t[10] !== void 0 ? parseFloat(t[10]) : void 0, W = t[11] !== void 0 ? parseFloat(t[11]) : void 0, P = t[12] !== void 0 ? parseFloat(t[12]) : void 0, Z = t.indexOf("#"), J = Z >= 0 && t[Z + 1] ? t[Z + 1] : void 0;
            o.frames.push({
              id: e,
              nI: n,
              nJ: a,
              E: r,
              A: l,
              I: F,
              Iy: I,
              J: u,
              nu: $,
              rho: v,
              D: W,
              B: P,
              sec: J
            });
            break;
          }
          case "cftc": {
            const e = parseInt(t[1], 10), n = parseFloat(t[2] ?? ""), a = parseFloat(t[3] ?? ""), r = parseFloat(t[4] ?? "25e6"), l = parseFloat(t[5] ?? "0.2"), F = parseFloat(t[6] ?? "2.4");
            isFinite(e) && n > 0 && a > 0 && a < n / 2 && r > 0 ? o.frameCftc.set(e, {
              D: n,
              t: a,
              Ec: r,
              nuC: isFinite(l) ? l : 0.2,
              rhoC: isFinite(F) && F >= 0 ? F : 2.4
            }) : o.errors.push(`cftc ${t[1]}: hace falta D t (m) y Ec (kN/m2), con t < D/2`);
            break;
          }
          case "isec":
          case "perfili": {
            const e = parseInt(t[1], 10), n = t.slice(2, 8).map(($) => parseFloat($)), [a, r, l, F] = n, I = isFinite(n[4]) ? n[4] : r, u = isFinite(n[5]) ? n[5] : l;
            isFinite(e) && a > 0 && r > 0 && l > 0 && F > 0 && I > 0 && u > 0 && l + u < a && F < Math.min(r, I) ? o.frameISec.set(e, {
              d: a,
              bf: r,
              tf: l,
              tw: F,
              t2b: I,
              tfb: u
            }) : o.errors.push(`isec ${t[1]}: hace falta d bf tf tw [t2b tfb] (m), con tf+tfb < d y tw < bf`);
            break;
          }
          case "tubo":
          case "tube": {
            const e = parseInt(t[1], 10), [n, a, r, l] = t.slice(2, 6).map((F) => parseFloat(F));
            isFinite(e) && n > 0 && a > 0 && r > 0 && l > 0 && l < n / 2 && r < a / 2 ? o.frameTube.set(e, {
              b: n,
              h: a,
              tf: r,
              tw: l
            }) : o.errors.push(`tubo ${t[1]}: hace falta b h tf tw (m), con tw < b/2 y tf < h/2`);
            break;
          }
          case "canal":
          case "channel": {
            const e = parseInt(t[1], 10), [n, a, r, l] = t.slice(2, 6).map((F) => parseFloat(F));
            isFinite(e) && n > 0 && a > 0 && r > 0 && l > 0 && 2 * r < n && l < a ? o.frameCanal.set(e, {
              d: n,
              bf: a,
              tf: r,
              tw: l
            }) : o.errors.push(`canal ${t[1]}: hace falta d bf tf tw (m), con 2\xB7tf < d y tw < bf`);
            break;
          }
          case "dosl":
          case "2l": {
            const e = parseInt(t[1], 10), [n, a, r, l, F] = t.slice(2, 7).map((u) => parseFloat(u)), I = (a - (F || 0)) / 2;
            isFinite(e) && n > 0 && a > 0 && r > 0 && l > 0 && F >= 0 && I > l && r < n ? o.frameDosL.set(e, {
              d: n,
              t2: a,
              tf: r,
              tw: l,
              dis: F
            }) : o.errors.push(`dosl ${t[1]}: hace falta d t2 tf tw dis (m), con (t2 \u2212 dis)/2 > tw`);
            break;
          }
          case "cft": {
            const e = parseInt(t[1], 10), n = t.slice(2).map((P) => parseFloat(P)), a = n.length >= 5 && n[3] < 1 && n[4] >= 1, r = n[0], l = n[1], F = n[2], I = a ? n[3] : n[2], u = a ? 4 : 3, $ = isFinite(n[u]) ? n[u] : 25e6, v = isFinite(n[u + 1]) ? n[u + 1] : 0.2, W = isFinite(n[u + 2]) ? n[u + 2] : 2.4;
            isFinite(e) && r > 0 && l > 0 && F > 0 && I > 0 && I < r / 2 && F < l / 2 && $ > 0 ? o.frameCft.set(e, {
              b: r,
              h: l,
              t: F,
              tw: I,
              Ec: $,
              nuC: v,
              rhoC: W >= 0 ? W : 2.4
            }) : o.errors.push(`cft ${t[1]}: hace falta b h t [tw] (m) y Ec (kN/m2), con tw < b/2 y t < h/2`);
            break;
          }
          case "as":
          case "shearareas": {
            const e = parseInt(t[1], 10), n = parseFloat(t[2] ?? "0"), a = parseFloat(t[3] ?? "0");
            isFinite(e) && isFinite(n) && isFinite(a) && o.frameShearAreas.set(e, [
              n,
              a
            ]);
            break;
          }
          case "release":
          case "rel": {
            const e = parseInt(t[1], 10), n = t.slice(2).map((r) => r.toLowerCase());
            if (!isFinite(e) || n.length === 0) {
              o.errors.push('release: se esperaba "release frameID <12 bits> | pin fix"');
              break;
            }
            const a = new Array(12).fill(false);
            if (n.length === 2 && n.every((r) => /^(pin|fix|libre|rigido)$/.test(r))) n.forEach((r, l) => {
              (r === "pin" || r === "libre") && (a[l * 6 + 4] = true, a[l * 6 + 5] = true);
            });
            else {
              const r = n.filter((l) => l === "0" || l === "1");
              if (r.length !== 12) {
                o.errors.push(`release ${e}: hacen falta 12 banderas (U1 U2 U3 R1 R2 R3 en I y en J), llegaron ${r.length}`);
                break;
              }
              for (let l = 0; l < 12; l++) a[l] = r[l] === "1";
            }
            a.some(Boolean) && o.frameReleases.set(e, a);
            break;
          }
          case "hex":
          case "solid":
          case "h8": {
            const e = parseInt(t[1], 10), n = t.slice(2, 10).map((a) => parseInt(a, 10));
            if (!isFinite(e) || n.length !== 8 || n.some((a) => !isFinite(a))) {
              o.errors.push(`hex ${t[1]}: hacen falta 8 nudos`);
              break;
            }
            o.solids.push({
              id: e,
              pts: n,
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
            const e = (t[1] ?? "safe").toLowerCase(), n = e === "safe" ? 0.1 : parseFloat(e);
            o.torsionFactor = isFinite(n) && n > 0 ? n : 1;
            break;
          }
          case "decksec": {
            const e = parseInt(t[1], 10), n = t.slice(2).map(parseFloat);
            if (!isFinite(e) || n.length < 5 || n.slice(0, 5).some((a) => !isFinite(a) || a < 0) || !(n[0] > 0)) {
              o.errors.push(`decksec ${t[1]}: se esperaba ID tc hr wrt wrb sr [w]`);
              break;
            }
            o.deckSecs.set(e, {
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
            const e = (t[1] ?? "etabs").toLowerCase();
            o.deckEtabs = e === "etabs" || e === "1" || e === "on" || e === "si", o.deckOneWay = t.slice(2).some((n) => /^(oneway|1way|unidireccional)$/i.test(n));
            break;
          }
          case "areaspring":
          case "winkler":
          case "springarea":
          case "winklerarea": {
            const e = parseInt(t[1], 10), n = parseFloat(t[2] ?? "0"), a = t.slice(3).some((l) => /^(nodal|lumped|sap|etabs)$/i.test(l)), r = t.slice(3).some((l) => /^(compresion|compression|compressiononly|solocompresion)$/i.test(l));
            isFinite(e) && isFinite(n) && n !== 0 ? o.areaSprings.push({
              id: e,
              ks: n,
              nodal: a,
              comp: r
            }) : o.errors.push("areaspring: uso areaspring <shellID> <ks> [nodal]");
            break;
          }
          case "edge":
          case "edgeconstraint": {
            const e = (t[1] ?? "etabs").toLowerCase();
            o.edgeEtabs = e === "etabs" || e === "1" || e === "on" || e === "si" || e === "hermite", o.edgeLineal = e === "lineal" || e === "linear" || e === "safe" || e === "sap" || e === "linea", o.edgeLineal && (o.edgeEtabs = true);
            break;
          }
          case "automesh":
          case "automallado": {
            const e = (t[1] ?? "1.25").toLowerCase();
            if (e === "off" || e === "no" || e === "0") {
              o.autoMesh = 0;
              break;
            }
            const n = parseFloat(e);
            o.autoMesh = isFinite(n) && n > 0 ? n : 1.25;
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
            const e = parseInt(t[1], 10), n = parseFloat(t[2] ?? "0"), a = parseFloat(t[3] ?? "0"), r = parseFloat(t[4] ?? "0");
            if (!isFinite(e) || !isFinite(n) || !isFinite(a)) {
              o.errors.push('endoffset: se esperaba "endoffset frameID offI offJ [rz]"');
              break;
            }
            o.frameEndOffsets.set(e, [
              n,
              a,
              isFinite(r) ? r : 0
            ]);
            break;
          }
          case "ang":
          case "localaxis": {
            const e = parseInt(t[1], 10), n = parseFloat(t[2] ?? "0");
            isFinite(e) && isFinite(n) && o.frameAngles.set(e, n);
            break;
          }
          case "shell":
          case "plate":
          case "s": {
            const e = parseInt(t[1], 10), n = [
              parseInt(t[2], 10),
              parseInt(t[3], 10),
              parseInt(t[4], 10),
              parseInt(t[5], 10)
            ], a = parseFloat(t[6] ?? "0.20"), r = parseFloat(t[7] ?? "25e6"), l = t[9] !== void 0 ? parseFloat(t[9]) : void 0, F = l !== void 0 && isFinite(l) ? l : void 0;
            if (o.shells.push({
              id: e,
              pts: n,
              t: a,
              E: r,
              rho: F
            }), t[8] !== void 0) {
              const I = parseFloat(t[8]);
              isFinite(I) && I !== 0 && o.shellLoads.set(e, I);
            }
            break;
          }
          case "tri": {
            const e = parseInt(t[1], 10), n = [
              parseInt(t[2], 10),
              parseInt(t[3], 10),
              parseInt(t[4], 10)
            ], a = parseFloat(t[5] ?? "0.20"), r = parseFloat(t[6] ?? "25e6"), l = t[8] !== void 0 ? parseFloat(t[8]) : void 0, F = l !== void 0 && isFinite(l) ? l : void 0;
            if (o.shells.push({
              id: e,
              pts: n,
              t: a,
              E: r,
              rho: F
            }), t[7] !== void 0) {
              const I = parseFloat(t[7]);
              isFinite(I) && I !== 0 && o.shellLoads.set(e, I);
            }
            break;
          }
          case "shelltype":
          case "plateform": {
            const e = parseInt(t[1], 10), n = (t[2] ?? "").toLowerCase();
            if (!isFinite(e)) break;
            let a;
            if (n === "thin" || n === "delgada" || n === "kirchhoff" || n === "1" ? a = 1 : n === "thick" || n === "gruesa" || n === "mindlin" || n === "0" ? a = 0 : n === "dkmq" || n === "3" ? a = 3 : (n === "wilson" || n === "dse" || n === "4") && (a = 4), a === void 0) {
              o.errors.push(`shelltype ${e}: se esperaba thin, thick, dkmq o wilson`);
              break;
            }
            o.shellTypes.set(e, a);
            break;
          }
          case "shellmod": {
            const e = parseInt(t[1], 10);
            if (!isFinite(e)) break;
            const n = t.slice(2).map(parseFloat);
            if (n.length >= 8) o.shellModsDir.set(e, n.slice(0, 8).map((a) => isFinite(a) ? a : 1));
            else {
              const a = n[0], r = n[1];
              o.shellMods.set(e, [
                isFinite(a) ? a : 1,
                isFinite(r) ? r : 1
              ]);
            }
            break;
          }
          case "areaobj": {
            const e = t.slice(1).map((v) => parseInt(v, 10));
            if (e.length < 7 || e.some((v) => !isFinite(v))) {
              o.errors.push('areaobj: se esperaba "areaobj ID n1 n2 n3 n4 desdeShell hastaShell"');
              break;
            }
            const [n, a, r, l, F, I, u] = e, $ = [];
            for (let v = I; v <= u; v++) $.push(v);
            o.areaObjs.push({
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
            const e = parseInt(t[1], 10), n = parseFloat(t[2]);
            if (!isFinite(e) || !isFinite(n)) {
              o.errors.push('shellang: se esperaba "shellang shellID grados"');
              break;
            }
            o.shellAngles.set(e, n);
            break;
          }
          case "areaload":
          case "qarea": {
            const e = parseInt(t[1], 10), n = parseFloat(t[2]);
            if (!isFinite(e) || !isFinite(n)) {
              o.errors.push('areaload: se esperaba "areaload shellID q"');
              break;
            }
            o.shellLoads.set(e, n);
            break;
          }
          case "support":
          case "fix": {
            const e = parseInt(t[1], 10), n = t.findIndex((r, l) => l >= 2 && r.startsWith("#")), a = t.slice(2, n < 0 ? void 0 : n).join(" ");
            o.supports.set(e, We(a));
            break;
          }
          case "load":
          case "l": {
            const e = parseInt(t[1], 10), n = parseFloat(t[2] ?? "0"), a = parseFloat(t[3] ?? "0"), r = parseFloat(t[4] ?? "0"), l = parseFloat(t[5] ?? "0"), F = parseFloat(t[6] ?? "0"), I = parseFloat(t[7] ?? "0"), u = t[8] && isNaN(parseFloat(t[8])) ? t[8] : "Dead";
            /^dead$/i.test(u) ? o.loads.set(e, [
              n,
              a,
              r,
              l,
              F,
              I
            ]) : (o.loadsPat.has(u) || o.loadsPat.set(u, /* @__PURE__ */ new Map()), o.loadsPat.get(u).set(e, [
              n,
              a,
              r,
              l,
              F,
              I
            ]));
            break;
          }
          case "frameload":
          case "fl": {
            const e = parseInt(t[1], 10), n = parseFloat(t[2] ?? "0"), a = parseFloat(t[3] ?? "0"), r = parseFloat(t[4] ?? "0"), l = t[5] && isNaN(parseFloat(t[5])) ? t[5] : "Dead", F = /^dead$/i.test(l) ? o.frameLoads : o.frameLoadsPat.get(l) ?? (o.frameLoadsPat.set(l, /* @__PURE__ */ new Map()), o.frameLoadsPat.get(l)), I = F.get(e) ?? [
              0,
              0,
              0
            ];
            F.set(e, [
              I[0] + n,
              I[1] + a,
              I[2] + r
            ]);
            break;
          }
          case "spring": {
            const e = parseInt(t[1], 10), n = (t[2] ?? "uz").toLowerCase(), a = Oe[n] ?? 2, r = parseFloat(t[3] ?? "1000");
            o.springs.push({
              node: e,
              dof: a,
              k: r
            });
            break;
          }
          case "diaph":
          case "diaphragm": {
            const e = parseInt(t[1], 10), n = parseInt(t[2] ?? "1", 10);
            isFinite(e) && isFinite(n) && n > 0 && o.diaphragms.set(e, n);
            break;
          }
          case "mass": {
            const e = parseInt(t[1], 10), n = parseFloat(t[2] ?? "0");
            Number.isFinite(e) && Number.isFinite(n) ? o.masses.set(e, (o.masses.get(e) ?? 0) + n) : o.errors.push(`L${Y + 1}: mass necesita <nudo> <toneladas>`);
            break;
          }
          case "vista": {
            const e = t.slice(1).filter((n) => !/^resultados?$/i.test(n));
            e[0] && (o.vista = {
              campo: e[0],
              caso: e[1]
            });
            break;
          }
          case "fc": {
            const e = parseFloat(t[1]);
            isFinite(e) && e > 0 ? o.fc = e : o.errors.push("fc: uso fc <kN/m2>");
            break;
          }
          case "combo":
          case "combinacion": {
            const e = t[1], n = [];
            for (let a = 2; a + 1 < t.length; a += 2) {
              const r = parseFloat(t[a + 1]);
              isFinite(r) && n.push([
                t[a],
                r
              ]);
            }
            e && n.length ? o.combos.push({
              name: e,
              items: n
            }) : o.errors.push("combo: uso combo NOMBRE patron factor [patron factor ...]");
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
            o.errors.push(`L${Y + 1}: comando desconocido "${T}"`);
        }
      } catch (e) {
        o.errors.push(`L${Y + 1}: error "${x}" \u2014 ${e.message}`);
      }
    }
    return o;
  };
  const es = `# CLI Modeler \u2014 escrib\xED comandos para construir un modelo
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
`, V = (f, o) => [
    f[0] - o[0],
    f[1] - o[1],
    f[2] - o[2]
  ], fe = (f, o) => f[0] * o[0] + f[1] * o[1] + f[2] * o[2], Fe = (f, o) => [
    f[1] * o[2] - f[2] * o[1],
    f[2] * o[0] - f[0] * o[2],
    f[0] * o[1] - f[1] * o[0]
  ], K = (f) => Math.hypot(f[0], f[1], f[2]), re = (f, o) => [
    f[0] * o,
    f[1] * o,
    f[2] * o
  ];
  function je(f, o) {
    const X = f.shellModsDir.get(o);
    return !!X && Math.abs(X[3]) < 1e-12 && Math.abs(X[4]) < 1e-12 && Math.abs(X[5]) < 1e-12;
  }
  function ss(f, o = 200, X) {
    const c = [
      0,
      1,
      2
    ].map((u) => (f[0][u] + f[1][u] + f[2][u] + f[3][u]) / 4);
    let S = V(f[1], f[0]), B = Fe(S, V(f[3], f[0]));
    B = re(B, 1 / K(B)), S = re(S, 1 / K(S));
    const O = Fe(B, S), Y = f.map((u) => [
      fe(V(u, c), S),
      fe(V(u, c), O)
    ]);
    let x = [
      0,
      1,
      2,
      3
    ];
    if (X) {
      const u = [
        0,
        1,
        2,
        3
      ].map(($) => {
        const v = V(f[($ + 1) % 4], f[$]);
        return Math.abs(fe(v, X)) / K(v);
      });
      x = [
        0,
        1,
        2,
        3
      ].sort(($, v) => u[$] - u[v]).slice(0, 2);
    }
    const t = Y.map((u) => u[0]), T = Y.map((u) => u[1]), e = Math.min(...t), n = Math.max(...t), a = Math.min(...T), r = Math.max(...T), l = [
      0,
      1,
      2,
      3
    ].map(() => ({
      pts: [],
      dA: 0
    }));
    let F = 0;
    for (let u = 0; u < o; u++) for (let $ = 0; $ < o; $++) {
      const v = e + (n - e) * (u + 0.5) / o, W = a + (r - a) * ($ + 0.5) / o;
      let P = 0, Z = 0;
      for (let _ = 0; _ < 4; _++) {
        const U = Y[_], se = Y[(_ + 1) % 4];
        (se[0] - U[0]) * (W - U[1]) - (se[1] - U[1]) * (v - U[0]) >= 0 ? P++ : Z++;
      }
      if (P !== 4 && Z !== 4) continue;
      let J = x[0], j = 1 / 0;
      for (const _ of x) {
        const U = Y[_], se = Y[(_ + 1) % 4], ne = se[0] - U[0], R = se[1] - U[1], pe = ne * ne + R * R, le = Math.max(0, Math.min(1, ((v - U[0]) * ne + (W - U[1]) * R) / pe)), te = Math.hypot(v - (U[0] + le * ne), W - (U[1] + le * R));
        te < j && (j = te, J = _);
      }
      l[J].pts.push([
        c[0] + v * S[0] + W * O[0],
        c[1] + v * S[1] + W * O[1],
        c[2] + v * S[2] + W * O[2]
      ]), F++;
    }
    const I = 0.5 * K(Fe(V(f[2], f[0]), V(f[3], f[1])));
    for (const u of l) u.dA = F ? I / F : 0;
    return l;
  }
  function ts(f, o) {
    if (!(o > 0)) return;
    const X = 1e-6, c = (T) => f.nodes.get(T);
    let S = Math.max(0, ...f.nodes.keys()) + 1, B = f.shells.reduce((T, e) => Math.max(T, e.id), 0) + 1;
    const O = (T) => {
      for (const [n, a] of f.nodes) if (K(V(a, T)) < X) return n;
      const e = S++;
      return f.nodes.set(e, [
        T[0],
        T[1],
        T[2]
      ]), e;
    }, Y = (T, e) => {
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
    }, x = [];
    let t = 0;
    for (const T of f.shells) {
      if (T.pts.length !== 4) {
        x.push(T);
        continue;
      }
      const e = T.pts.map(c);
      if (e.some((u) => !u)) {
        x.push(T);
        continue;
      }
      const n = (K(V(e[1], e[0])) + K(V(e[2], e[3]))) / 2, a = (K(V(e[3], e[0])) + K(V(e[2], e[1]))) / 2, r = Math.max(1, Math.ceil(n / o - 1e-9)), l = Math.max(1, Math.ceil(a / o - 1e-9));
      if (r === 1 && l === 1) {
        x.push(T);
        continue;
      }
      const F = (u, $) => [
        0,
        1,
        2
      ].map((v) => e[0][v] * (1 - u) * (1 - $) + e[1][v] * u * (1 - $) + e[2][v] * u * $ + e[3][v] * (1 - u) * $), I = [];
      for (let u = 0; u <= r; u++) {
        const $ = [];
        for (let v = 0; v <= l; v++) $.push(O(F(u / r, v / l)));
        I.push($);
      }
      for (let u = 0; u < r; u++) for (let $ = 0; $ < l; $++) {
        const v = u === 0 && $ === 0 ? T.id : B++;
        x.push({
          ...T,
          id: v,
          pts: [
            I[u][$],
            I[u + 1][$],
            I[u + 1][$ + 1],
            I[u][$ + 1]
          ]
        }), v !== T.id && Y(T.id, v);
      }
      t++;
    }
    t && (f.shells = x, console.log(`[CLI Modeler] automesh ${o} m: ${t} pano(s) partido(s) -> ${f.shells.length} cascaras, ${f.nodes.size} nudos`));
  }
  function os(f) {
    const X = (a) => f.nodes.get(a), c = [
      ...f.nodes.keys()
    ], S = (a, r, l) => {
      const F = V(r, a), I = K(F), u = re(F, 1 / I), $ = [];
      for (const v of c) {
        if (l.includes(v)) continue;
        const W = V(X(v), a), P = fe(W, u);
        P > 1e-6 && P < I - 1e-6 && K(V(W, re(u, P))) < 1e-4 && $.push(P / I);
      }
      return $.sort((v, W) => v - W);
    }, B = (a, r) => {
      const l = [];
      for (const F of a) r.some((I) => Math.abs(F - I) < 1e-5) && !l.some((I) => Math.abs(F - I) < 1e-5) && l.push(F);
      return l;
    }, O = (a) => {
      for (const r of c) if (K(V(X(r), a)) < 1e-4) return r;
    };
    let Y = f.shells.reduce((a, r) => Math.max(a, r.id), 0) + 1;
    const x = [], t = (a, r) => {
      const l = f.shellModsDir.get(a);
      l && f.shellModsDir.set(r, [
        ...l
      ]);
      const F = f.shellMods.get(a);
      F && f.shellMods.set(r, [
        ...F
      ]);
      const I = f.shellLoads.get(a);
      I !== void 0 && f.shellLoads.set(r, I);
      const u = f.shellTypes.get(a);
      u !== void 0 && f.shellTypes.set(r, u);
      const $ = f.shellAngles.get(a);
      $ !== void 0 && f.shellAngles.set(r, $);
    };
    for (const a of f.shells) {
      if (!je(f, a.id) || a.pts.length !== 4 || a.pts.some((J) => !f.nodes.has(J))) {
        x.push(a);
        continue;
      }
      const r = a.pts.map(X), l = S(r[0], r[1], a.pts), F = S(r[2], r[3], a.pts).map((J) => 1 - J), I = S(r[1], r[2], a.pts), u = S(r[3], r[0], a.pts).map((J) => 1 - J);
      let $ = [
        0,
        ...B(l, F),
        1
      ], v = [
        0,
        ...B(I, u),
        1
      ];
      if ($.length === 2 && v.length === 2) {
        x.push(a);
        continue;
      }
      const W = (J, j) => [
        0,
        1,
        2
      ].map((_) => (1 - J) * (1 - j) * r[0][_] + J * (1 - j) * r[1][_] + J * j * r[2][_] + (1 - J) * j * r[3][_]);
      let P = v.map((J) => $.map((j) => O(W(j, J))));
      if (P.some((J) => J.some((j) => j === void 0)) && ($.length >= v.length ? v = [
        0,
        1
      ] : $ = [
        0,
        1
      ], P = v.map((J) => $.map((j) => O(W(j, J)))), P.some((J) => J.some((j) => j === void 0)))) {
        x.push(a);
        continue;
      }
      let Z = true;
      for (let J = 0; J < v.length - 1; J++) for (let j = 0; j < $.length - 1; j++) {
        const _ = [
          P[J][j],
          P[J][j + 1],
          P[J + 1][j + 1],
          P[J + 1][j]
        ], U = Z ? a.id : Y++;
        Z || t(a.id, U), Z = false, x.push({
          id: U,
          pts: _,
          t: a.t,
          E: a.E,
          rho: a.rho
        });
      }
    }
    f.shells = x;
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
      const l = V(r, a), F = K(l), I = re(l, 1 / F);
      return f.frames.filter((u) => [
        u.nI,
        u.nJ
      ].every(($) => {
        const v = f.nodes.get($);
        if (!v) return false;
        const W = V(v, a), P = fe(W, I);
        return P > -1e-4 && P < F + 1e-4 && K(V(W, re(I, P))) < 1e-4;
      }));
    };
    for (const a of f.shells) {
      if (!je(f, a.id) || a.pts.length !== 4) continue;
      const r = f.selfWeight ? (a.rho ?? 2.45) * a.t * T * f.selfWeight : 0, l = f.shellLoads.get(a.id) ?? 0, F = -r + l;
      if (Math.abs(F) < 1e-15) continue;
      const I = a.pts.map(X);
      let u;
      if (f.deckOneWay) {
        const v = V(I[1], I[0]);
        let W = Fe(v, V(I[3], I[0]));
        W = re(W, 1 / K(W));
        const P = re(v, 1 / K(v)), Z = Fe(W, P), J = (f.shellAngles.get(a.id) ?? 0) * Math.PI / 180;
        u = [
          0,
          1,
          2
        ].map((j) => Math.cos(J) * P[j] + Math.sin(J) * Z[j]);
      }
      const $ = ss(I, 200, u);
      for (let v = 0; v < 4; v++) {
        const { pts: W, dA: P } = $[v];
        if (!W.length) continue;
        const Z = I[v], J = I[(v + 1) % 4], j = n(Z, J);
        if (!j.length) {
          const R = F * P * W.length;
          e(a.pts[v], [
            0,
            0,
            R / 2,
            0,
            0,
            0
          ]), e(a.pts[(v + 1) % 4], [
            0,
            0,
            R / 2,
            0,
            0,
            0
          ]);
          continue;
        }
        const _ = V(J, Z), U = K(_), se = re(_, 1 / U), ne = W.map((R) => fe(V(R, Z), se));
        for (const R of j) {
          const pe = X(R.nI), le = X(R.nJ), te = fe(V(pe, Z), se), be = fe(V(le, Z), se), Me = Math.min(te, be), ie = Math.max(te, be), Q = ie - Me;
          if (Q < 1e-9) continue;
          const Ce = ie >= U - 1e-6, oe = re(V(le, pe), 1 / Q), ee = Fe(oe, [
            0,
            0,
            1
          ]);
          let he = 0, ce = 0, Ie = 0, me = 0;
          for (const de of ne) {
            if (de < Me - 1e-9 || (Ce ? de > ie + 1e-9 : de >= ie - 1e-9)) continue;
            let we = de - Me;
            te > be && (we = Q - we);
            const G = we / Q;
            he += 1 - 3 * G * G + 2 * G * G * G, ce += Q * (G - 2 * G * G + G * G * G), Ie += 3 * G * G - 2 * G * G * G, me += Q * (-G * G + G * G * G);
          }
          const ae = F * P;
          e(R.nI, [
            0,
            0,
            ae * he,
            ee[0] * ae * ce,
            ee[1] * ae * ce,
            ee[2] * ae * ce
          ]), e(R.nJ, [
            0,
            0,
            ae * Ie,
            ee[0] * ae * me,
            ee[1] * ae * me,
            ee[2] * ae * me
          ]);
        }
      }
      f.deckTributario.add(a.id), f.shellLoads.delete(a.id);
    }
  }
  ls = {
    id: "cli-modeler",
    name: "CLI Modeler (comandos)",
    category: "\u{1F9EA} Utilidades",
    defaultShellResult: "none",
    availableShellResults: [
      "none",
      "pressure",
      "membraneXX",
      "membraneYY",
      "membraneXY",
      "membranePrincipalMax",
      "membranePrincipalMin",
      "vonMises",
      "tranverseShearX",
      "tranverseShearY",
      "transverseShearMax",
      "bendingXX",
      "bendingYY",
      "bendingXY",
      "bendingPrincipalMax",
      "bendingPrincipalMin",
      "displacementX",
      "displacementY",
      "displacementZ"
    ],
    params: {},
    hasModal: true,
    runModal(f, o, X) {
      var _a;
      const c = o.nodes.val, S = o.elements.val;
      if (!(!c.length || !S.length)) try {
        const B = Math.max(1, parseInt(window.__hekatanCliModalModes ?? "12", 10) || 12), O = o.nodeInputs.val, Y = window.__hekatanCliSprings, x = He(c, S, O, o.elementInputs.val, B, 0, 0, 1, (O == null ? void 0 : O.diaphragms) instanceof Map && O.diaphragms.size ? O.diaphragms : void 0, Y && Y.length ? Y : void 0);
        console.log(`[CLI Modeler] Modal OK \u2014 ${x.frequencies.length} modos, T1 = ${x.frequencies[0] ? (1 / x.frequencies[0]).toFixed(5) : "\u2014"} s`), (_a = X == null ? void 0 : X.render) == null ? void 0 : _a.call(X, x, {
          title: "Modal del .heks (masa 3D, como SAP2000)"
        });
      } catch (B) {
        console.error("[CLI Modeler] modal:", (B == null ? void 0 : B.message) ?? B);
      }
    },
    build(f, o) {
      var _a, _b;
      const X = window.__hekatanCliScript ?? es;
      window.__hekatanCliLastScript = X;
      const c = Qe(X);
      c.autoMesh > 0 && ts(c, c.autoMesh), c.deckEtabs && os(c);
      const S = /* @__PURE__ */ new Map(), B = /* @__PURE__ */ new Map(), O = [], Y = Array.from(c.nodes.keys()).sort((s, d) => s - d);
      for (const s of Y) S.set(s, O.length), O.push(c.nodes.get(s));
      const x = [], t = /* @__PURE__ */ new Map(), T = /* @__PURE__ */ new Map(), e = /* @__PURE__ */ new Map(), n = /* @__PURE__ */ new Map(), a = /* @__PURE__ */ new Map(), r = /* @__PURE__ */ new Map(), l = /* @__PURE__ */ new Map(), F = /* @__PURE__ */ new Map(), I = /* @__PURE__ */ new Map(), u = /* @__PURE__ */ new Map(), $ = /* @__PURE__ */ new Map(), v = /* @__PURE__ */ new Map(), W = /* @__PURE__ */ new Map(), P = /* @__PURE__ */ new Map(), Z = /* @__PURE__ */ new Map(), J = /* @__PURE__ */ new Map(), j = /* @__PURE__ */ new Map(), _ = /* @__PURE__ */ new Map(), U = /* @__PURE__ */ new Map(), se = /* @__PURE__ */ new Map();
      for (const s of c.frames) {
        const d = S.get(s.nI), M = S.get(s.nJ);
        if (d === void 0 || M === void 0) {
          const w = Y.length ? `IDs disponibles: ${Y.join(", ")}` : "ning\xFAn nodo definido", A = [];
          d === void 0 && A.push(s.nI), M === void 0 && A.push(s.nJ), c.errors.push(`frame ${s.id}: nodo(s) inexistente(s) [${A.join(", ")}] \u2014 ${w}`);
          continue;
        }
        const i = x.length;
        x.push([
          d,
          M
        ]);
        const p = s.nu ?? 0.2;
        t.set(i, s.E), T.set(i, s.E / (2 * (1 + p))), e.set(i, s.A), n.set(i, s.I), a.set(i, s.Iy ?? s.I), r.set(i, s.J ?? 0.14 * Math.pow(Math.sqrt(s.A), 4)), l.set(i, s.rho ?? 2.45), U.set(i, p), s.D !== void 0 && isFinite(s.D) && F.set(i, s.D), s.B !== void 0 && isFinite(s.B) && I.set(i, s.B);
        const m = c.frameAngles.get(s.id);
        m !== void 0 && isFinite(m) && $.set(i, m);
        const g = c.frameReleases.get(s.id);
        g && v.set(i, g);
        const h = c.frameEndOffsets.get(s.id);
        h && W.set(i, h);
        const k = c.frameLoads.get(s.id);
        k && J.set(i, k);
        const E = c.frameShearAreas.get(s.id);
        if (E && (_.set(i, E[0]), j.set(i, E[1])), s.sec || s.D !== void 0 && s.B !== void 0) {
          const w = {
            type: "general"
          };
          s.sec && (w.name = s.sec), s.D !== void 0 && isFinite(s.D) && (w.h = s.D), s.B !== void 0 && isFinite(s.B) && (w.b = s.B), u.set(i, w);
        }
        const b = c.frameISec.get(s.id);
        if (b) {
          const w = Ne(b.d, b.bf, b.tf, b.tw, b.t2b, b.tfb);
          e.set(i, w.A), a.set(i, w.Iz), n.set(i, w.Iy), r.set(i, w.J), _.set(i, w.As2), j.set(i, w.As3), F.set(i, b.d), I.set(i, Math.max(b.bf, b.t2b));
          const A = (N) => Math.round(N * 1e4) / 10;
          u.set(i, {
            type: "I",
            h: b.d,
            b: b.bf,
            tf: b.tf,
            tw: b.tw,
            t2b: b.t2b,
            tfb: b.tfb,
            name: s.sec ?? `I${A(b.d)}X${A(b.bf)}X${A(b.tf)}X${A(b.tw)}`
          });
        }
        const y = c.frameTube.get(s.id);
        if (y) {
          const w = qe(y.b, y.h, y.tf, y.tw);
          e.set(i, w.A), a.set(i, w.Iz), n.set(i, w.Iy), r.set(i, w.J), _.set(i, w.As2), j.set(i, w.As3), F.set(i, y.h), I.set(i, y.b);
          const A = (N) => Math.round(N * 1e4) / 10;
          u.set(i, {
            type: "HSS",
            h: y.h,
            b: y.b,
            tf: y.tf,
            tw: y.tw,
            name: s.sec ?? `TUBO${A(y.h)}X${A(y.b)}X${A(y.tf)}X${A(y.tw)}`
          });
        }
        const C = c.frameCanal.get(s.id);
        if (C) {
          const w = _e(C.d, C.bf, C.tf, C.tw);
          e.set(i, w.A), a.set(i, w.Iz), n.set(i, w.Iy), r.set(i, w.J), _.set(i, w.As2), j.set(i, w.As3), F.set(i, C.d), I.set(i, C.bf);
          const A = (N) => Math.round(N * 1e4) / 10;
          u.set(i, {
            type: "C",
            h: C.d,
            b: C.bf,
            tf: C.tf,
            tw: C.tw,
            name: s.sec ?? `C${A(C.d)}X${A(C.bf)}X${A(C.tf)}X${A(C.tw)}`
          });
        }
        const z = c.frameDosL.get(s.id);
        if (z) {
          const w = Be(z.d, z.t2, z.tf, z.tw, z.dis);
          e.set(i, w.A), a.set(i, w.Iz), n.set(i, w.Iy), r.set(i, w.J), _.set(i, w.As2), j.set(i, w.As3), F.set(i, z.d), I.set(i, z.t2);
          const A = (N) => Math.round(N * 1e4) / 10;
          u.set(i, {
            type: "2L",
            h: z.d,
            b: z.t2,
            tf: z.tf,
            tw: z.tw,
            dis: z.dis,
            name: s.sec ?? `2L${A(z.d)}X${A(z.t2)}X${A(z.tf)}X${A(z.tw)}S${A(z.dis)}`
          });
        }
        const L = c.frameCftc.get(s.id);
        if (L) {
          const w = Ye(L.D, L.t, s.E, p, L.Ec, L.nuC);
          e.set(i, w.A), a.set(i, w.Iz), n.set(i, w.Iy), r.set(i, w.J), _.set(i, w.As2), j.set(i, w.As3), F.set(i, L.D), I.set(i, L.D);
          const A = L.D - 2 * L.t, N = Math.PI * A * A / 4, q = Math.PI * L.D * L.D / 4 - N;
          l.set(i, ((s.rho ?? 7.85) * q + L.rhoC * N) / w.A), u.set(i, {
            type: "CFT",
            d: L.D,
            tw: L.t,
            fillE: L.Ec,
            fillRho: L.rhoC,
            steelRho: s.rho ?? 7.85,
            name: s.sec ?? `CFTC ${Math.round(L.D * 1e3)}X${Math.round(L.t * 1e3)}`
          });
        }
        const D = c.frameCft.get(s.id);
        if (D) {
          const w = Ue(D.b, D.h, D.t, s.E, p, D.Ec, D.nuC, D.tw);
          e.set(i, w.A), a.set(i, w.Iz), n.set(i, w.Iy), r.set(i, w.J), _.set(i, w.As2), j.set(i, w.As3), F.set(i, D.h), I.set(i, D.b);
          const A = (D.b - 2 * D.tw) * (D.h - 2 * D.t), N = D.b * D.h - A;
          l.set(i, ((s.rho ?? 7.85) * N + D.rhoC * A) / w.A);
          const q = (H) => Math.round(H * 1e3);
          u.set(i, {
            type: "CFT",
            b: D.b,
            h: D.h,
            tw: D.tw,
            tf: D.t,
            fillE: D.Ec,
            fillRho: D.rhoC,
            steelRho: s.rho ?? 7.85,
            name: s.sec ?? `CFT ${q(D.h)}X${q(D.b)}X${q(D.t)}${D.tw !== D.t ? `X${q(D.tw)}` : ""}`
          });
        }
      }
      if (c.meshCross) {
        const s = (g, h) => g[0] * h[0] + g[1] * h[1] + g[2] * h[2], d = [
          t,
          T,
          e,
          n,
          a,
          r,
          l,
          U,
          F,
          I,
          $,
          j,
          _,
          u,
          J
        ], M = (g, h) => {
          for (const k of d) k.has(g) && k.set(h, k.get(g));
        }, i = (g) => {
          for (let h = 0; h < O.length; h++) if (Math.hypot(O[h][0] - g[0], O[h][1] - g[1], O[h][2] - g[2]) < 1e-6) return h;
          return O.push([
            g[0],
            g[1],
            g[2]
          ]), O.length - 1;
        }, p = (g) => {
          const h = O[g[0]], k = O[g[1]];
          return [
            Math.min(h[0], k[0]),
            Math.min(h[1], k[1]),
            Math.min(h[2], k[2]),
            Math.max(h[0], k[0]),
            Math.max(h[1], k[1]),
            Math.max(h[2], k[2])
          ];
        };
        let m = 0;
        for (let g = 0; g < x.length; g++) {
          if (x[g].length !== 2) continue;
          const h = p(x[g]);
          for (let k = g + 1; k < x.length; k++) {
            if (x[k].length !== 2) continue;
            const [E, b] = x[g], [y, C] = x[k];
            if (E === y || E === C || b === y || b === C) continue;
            const z = p(x[k]);
            if (h[0] > z[3] + 1e-6 || z[0] > h[3] + 1e-6 || h[1] > z[4] + 1e-6 || z[1] > h[4] + 1e-6 || h[2] > z[5] + 1e-6 || z[2] > h[5] + 1e-6) continue;
            const L = O[E], D = O[b], w = O[y], A = O[C], N = [
              D[0] - L[0],
              D[1] - L[1],
              D[2] - L[2]
            ], q = [
              A[0] - w[0],
              A[1] - w[1],
              A[2] - w[2]
            ], H = [
              L[0] - w[0],
              L[1] - w[1],
              L[2] - w[2]
            ], ue = s(N, N), ye = s(N, q), $e = s(q, q), ze = s(N, H), Te = s(q, H), Ae = ue * $e - ye * ye;
            if (Ae < 1e-10 * ue * $e) continue;
            const ve = (ye * Te - $e * ze) / Ae, ke = (ue * Te - ye * ze) / Ae;
            if (ve < 1e-6 || ve > 1 - 1e-6 || ke < 1e-6 || ke > 1 - 1e-6) continue;
            const Le = [
              L[0] + ve * N[0],
              L[1] + ve * N[1],
              L[2] + ve * N[2]
            ], Se = [
              w[0] + ke * q[0],
              w[1] + ke * q[1],
              w[2] + ke * q[2]
            ];
            if (Math.hypot(Le[0] - Se[0], Le[1] - Se[1], Le[2] - Se[2]) > 1e-6) continue;
            const Xe = i(Le);
            for (const ge of [
              g,
              k
            ]) {
              const [Pe, Re] = x[ge], Ee = x.length;
              x[ge] = [
                Pe,
                Xe
              ], x.push([
                Xe,
                Re
              ]), M(ge, Ee);
              const De = v.get(ge);
              De && (v.set(ge, [
                ...De.slice(0, 6),
                ...Array(6).fill(false)
              ]), v.set(Ee, [
                ...Array(6).fill(false),
                ...De.slice(6)
              ]));
              const xe = W.get(ge);
              xe && (W.set(ge, [
                xe[0],
                0,
                xe[2]
              ]), W.set(Ee, [
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
        const d = s.pts.map((m) => S.get(m));
        if (d.some((m) => m === void 0)) {
          c.errors.push(`shell ${s.id}: algun nodo inexistente`);
          continue;
        }
        const M = x.length;
        B.set(s.id, M), x.push(d), t.set(M, s.E), T.set(M, s.E / (2 * 1.2)), se.set(M, s.t), l.set(M, s.rho ?? 2.45), U.set(M, 0.2);
        const i = c.shellTypes.get(s.id);
        i !== void 0 && P.set(M, i);
        const p = c.deckSecs.get(s.id);
        if (p) {
          const m = p.tc + (p.sr > 0 ? p.hr * (p.wrt + p.wrb) / 2 / p.sr : 0);
          se.set(M, p.tc), l.set(M, ((s.rho ?? 2.45) * m + p.w / 9.80665) / p.tc), Z.set(M, {
            ...p
          });
        }
      }
      const ne = /* @__PURE__ */ new Map();
      for (const [s, d] of c.supports.entries()) {
        const M = S.get(s);
        M !== void 0 && ne.set(M, d);
      }
      const R = /* @__PURE__ */ new Map();
      for (const [s, d] of c.loads.entries()) {
        const M = S.get(s);
        M !== void 0 && R.set(M, [
          ...d
        ]);
      }
      const pe = /* @__PURE__ */ new Map();
      for (const [s, d] of c.diaphragms.entries()) {
        const M = S.get(s);
        M !== void 0 && pe.set(M, d);
      }
      const le = /* @__PURE__ */ new Map();
      for (const [s, d] of c.masses.entries()) {
        const M = S.get(s);
        M !== void 0 && le.set(M, d);
      }
      const te = /* @__PURE__ */ new Map();
      for (const [s, d] of c.loadsPat) {
        const M = /* @__PURE__ */ new Map();
        for (const [i, p] of d) {
          const m = S.get(i);
          m !== void 0 && M.set(m, [
            ...p
          ]);
        }
        te.set(s, M);
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
      ].map(([M, i]) => [
        M,
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
        const M = (i, p) => {
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
          const m = c.frames.find((D) => D.id === i);
          if (!m) {
            c.errors.push(`frameload ${i}: no existe esa barra`);
            continue;
          }
          const g = S.get(m.nI), h = S.get(m.nJ);
          if (g === void 0 || h === void 0) continue;
          const k = O[g], E = O[h], b = [
            E[0] - k[0],
            E[1] - k[1],
            E[2] - k[2]
          ], y = Math.hypot(b[0], b[1], b[2]);
          if (y < 1e-9) continue;
          const C = [
            b[0] / y,
            b[1] / y,
            b[2] / y
          ], z = y * y / 12, L = [
            C[1] * p[2] - C[2] * p[1],
            C[2] * p[0] - C[0] * p[2],
            C[0] * p[1] - C[1] * p[0]
          ];
          M(g, [
            p[0] * y / 2,
            p[1] * y / 2,
            p[2] * y / 2,
            z * L[0],
            z * L[1],
            z * L[2]
          ]), M(h, [
            p[0] * y / 2,
            p[1] * y / 2,
            p[2] * y / 2,
            -z * L[0],
            -z * L[1],
            -z * L[2]
          ]);
        }
      }
      const ie = /* @__PURE__ */ new Map(), Q = 1 / Math.sqrt(3), Ce = [
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
        const M = s.pts.map((m) => S.get(m));
        if (M.some((m) => m === void 0)) {
          c.errors.push(`areaload ${s.id}: algun nodo inexistente`);
          continue;
        }
        const i = M.map((m) => O[m]);
        if (M.length === 3) {
          const m = [
            0,
            1,
            2
          ].map((k) => i[1][k] - i[0][k]), g = [
            0,
            1,
            2
          ].map((k) => i[2][k] - i[0][k]), h = Math.hypot(m[1] * g[2] - m[2] * g[1], m[2] * g[0] - m[0] * g[2], m[0] * g[1] - m[1] * g[0]) / 2;
          for (const k of M) {
            const E = R.get(k) ?? [
              0,
              0,
              0,
              0,
              0,
              0
            ];
            E[2] += d * h / 3, R.set(k, E), ie.set(k, (ie.get(k) ?? 0) + d * h / 3);
          }
          continue;
        }
        const p = [
          0,
          0,
          0,
          0
        ];
        for (const [m, g] of Ce) {
          const h = [
            0.25 * (1 - m) * (1 - g),
            0.25 * (1 + m) * (1 - g),
            0.25 * (1 + m) * (1 + g),
            0.25 * (1 - m) * (1 + g)
          ], k = [
            -0.25 * (1 - g),
            0.25 * (1 - g),
            0.25 * (1 + g),
            -0.25 * (1 + g)
          ], E = [
            -0.25 * (1 - m),
            -0.25 * (1 + m),
            0.25 * (1 + m),
            0.25 * (1 - m)
          ], b = [
            0,
            1,
            2
          ].map((L) => k.reduce((D, w, A) => D + w * i[A][L], 0)), y = [
            0,
            1,
            2
          ].map((L) => E.reduce((D, w, A) => D + w * i[A][L], 0)), C = [
            b[1] * y[2] - b[2] * y[1],
            b[2] * y[0] - b[0] * y[2],
            b[0] * y[1] - b[1] * y[0]
          ], z = Math.hypot(C[0], C[1], C[2]);
          for (let L = 0; L < 4; L++) p[L] += h[L] * d * z;
        }
        for (let m = 0; m < 4; m++) {
          const g = M[m], h = R.get(g) ?? [
            0,
            0,
            0,
            0,
            0,
            0
          ];
          h[2] += p[m], R.set(g, h), ie.set(g, (ie.get(g) ?? 0) + p[m]);
        }
      }
      if (c.selfWeight) {
        const d = /* @__PURE__ */ new Set();
        for (const [i, p] of B) c.deckTributario.has(i) && d.add(p);
        const M = (i, p) => {
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
        x.forEach((i, p) => {
          const m = l.get(p) ?? 0;
          if (m && !d.has(p)) {
            if (i.length === 2) {
              const g = e.get(p) ?? 0, h = O[i[0]], k = O[i[1]], E = [
                k[0] - h[0],
                k[1] - h[1],
                k[2] - h[2]
              ];
              let b = Math.hypot(E[0], E[1], E[2]);
              const y = W.get(p);
              if (y) {
                const N = Math.hypot(E[0], E[1]);
                N > 1e-9 && Math.abs(Math.atan2(Math.abs(E[2]), N)) * 180 / Math.PI < 20 && (b = Math.max(b - y[0] - y[1], 0));
              }
              const C = Math.hypot(E[0], E[1], E[2]), z = -g * m * 9.80665 * c.selfWeight, L = [
                E[0] / C,
                E[1] / C,
                E[2] / C
              ], D = b * b / 12, w = [
                L[1] * z,
                -L[0] * z,
                0
              ], A = (N, q) => {
                const H = R.get(N) ?? [
                  0,
                  0,
                  0,
                  0,
                  0,
                  0
                ];
                R.set(N, [
                  H[0] + q[0],
                  H[1] + q[1],
                  H[2] + q[2],
                  H[3] + q[3],
                  H[4] + q[4],
                  H[5] + q[5]
                ]);
              };
              A(i[0], [
                0,
                0,
                z * b / 2,
                D * w[0],
                D * w[1],
                0
              ]), A(i[1], [
                0,
                0,
                z * b / 2,
                -D * w[0],
                -D * w[1],
                0
              ]);
            } else if (i.length === 4 || i.length === 3) {
              const g = se.get(p) ?? 0, h = i.map((b) => O[b]);
              let k = 0;
              for (let b = 1; b < i.length - 1; b++) {
                const y = [
                  h[b][0] - h[0][0],
                  h[b][1] - h[0][1],
                  h[b][2] - h[0][2]
                ], C = [
                  h[b + 1][0] - h[0][0],
                  h[b + 1][1] - h[0][1],
                  h[b + 1][2] - h[0][2]
                ], z = [
                  y[1] * C[2] - y[2] * C[1],
                  y[2] * C[0] - y[0] * C[2],
                  y[0] * C[1] - y[1] * C[0]
                ];
                k += Math.hypot(z[0], z[1], z[2]) / 2;
              }
              const E = k * g * m * 9.80665 * c.selfWeight;
              for (const b of i) M(b, -E / i.length);
            }
          }
        });
      }
      const oe = [];
      for (const s of c.springs) {
        const d = S.get(s.node);
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
        const s = c.edgeLineal, d = s ? 1e-4 : 1e-6, M = /* @__PURE__ */ new Set(), i = [];
        x.forEach((m, g) => {
          if (m.length === 3 || m.length === 4) {
            i.push(g);
            for (const h of m) M.add(h);
          }
        });
        let p = 0;
        for (const m of i) {
          const g = x[m], h = g.map((E) => O[E]), k = [
            0,
            1,
            2
          ].map((E) => [
            Math.min(...h.map((b) => b[E])),
            Math.max(...h.map((b) => b[E]))
          ]);
          for (let E = 0; E < O.length; E++) {
            if (g.includes(E)) continue;
            const b = O[E], y = s ? d * Math.max(k[0][1] - k[0][0], k[1][1] - k[1][0], k[2][1] - k[2][0]) : 1e-6;
            if (b[0] < k[0][0] - y || b[0] > k[0][1] + y || b[1] < k[1][0] - y || b[1] > k[1][1] + y || b[2] < k[2][0] - y || b[2] > k[2][1] + y) continue;
            let C = false;
            for (let L = 0; L < g.length && !C; L++) {
              const D = h[L], w = h[(L + 1) % g.length], A = [
                w[0] - D[0],
                w[1] - D[1],
                w[2] - D[2]
              ], N = A[0] * A[0] + A[1] * A[1] + A[2] * A[2];
              if (N < 1e-24) continue;
              const q = [
                b[0] - D[0],
                b[1] - D[1],
                b[2] - D[2]
              ], H = (q[0] * A[0] + q[1] * A[1] + q[2] * A[2]) / N;
              if (H <= 1e-6 || H >= 1 - 1e-6) continue;
              const ue = [
                q[0] - H * A[0],
                q[1] - H * A[1],
                q[2] - H * A[2]
              ];
              Math.hypot(ue[0], ue[1], ue[2]) <= d * Math.sqrt(N) && (C = true);
            }
            !C || !(s || x.some((L, D) => D !== m && L.includes(E))) || (oe.push({
              node: -(m + 1),
              dof: s ? -4 : -2,
              k: E
            }), p++);
          }
        }
        p && console.log(`[CLI Modeler] edge ${s ? "lineal" : "etabs"}: ${p} nudo(s) colgado(s) atado(s) a su arista (${s ? "lineal" : "Hermite"})`);
      }
      const ee = [];
      for (const s of c.solids) {
        const d = s.pts.map((i) => S.get(i));
        if (d.some((i) => i === void 0)) {
          c.errors.push(`hex ${s.id}: algun nodo inexistente`);
          continue;
        }
        const M = x.length;
        if (x.push(d), t.set(M, s.E), U.set(M, s.nu), T.set(M, s.E / (2 * (1 + s.nu))), l.set(M, s.rho), ee.push(M), c.selfWeight && s.rho) {
          const i = d.map((h) => O[h]), p = (h, k, E, b) => {
            const y = [
              0,
              1,
              2
            ].map((L) => i[k][L] - i[h][L]), C = [
              0,
              1,
              2
            ].map((L) => i[E][L] - i[h][L]), z = [
              0,
              1,
              2
            ].map((L) => i[b][L] - i[h][L]);
            return Math.abs(y[0] * (C[1] * z[2] - C[2] * z[1]) - y[1] * (C[0] * z[2] - C[2] * z[0]) + y[2] * (C[0] * z[1] - C[1] * z[0])) / 6;
          }, g = (p(0, 1, 2, 6) + p(0, 2, 3, 6) + p(0, 3, 7, 6) + p(0, 7, 4, 6) + p(0, 4, 5, 6) + p(0, 5, 1, 6)) * s.rho * 9.80665 * c.selfWeight;
          for (const h of d) {
            const k = R.get(h) ?? [
              0,
              0,
              0,
              0,
              0,
              0
            ];
            k[2] -= g / 8, R.set(h, k);
          }
        }
      }
      o.nodes.val = O, o.elements.val = x, o.nodeInputs.val = {
        supports: ne,
        loads: R,
        masses: le,
        diaphragms: pe,
        cargasPorPatron: be,
        springs: oe
      }, o.springs && (o.springs.val = oe);
      const he = /* @__PURE__ */ new Map(), ce = /* @__PURE__ */ new Map(), Ie = /* @__PURE__ */ new Map(), me = /* @__PURE__ */ new Map(), ae = /* @__PURE__ */ new Map();
      for (const s of c.shells) {
        const d = B.get(s.id);
        if (d === void 0) continue;
        const M = c.shellLoads.get(s.id);
        M !== void 0 && me.set(d, M);
        const i = c.shellAngles.get(s.id);
        i !== void 0 && ae.set(d, i);
        const p = c.shellModsDir.get(s.id);
        if (p) {
          Ie.set(d, p), he.set(d, (p[0] + p[1]) / 2), ce.set(d, (p[3] + p[4]) / 2);
          continue;
        }
        const m = c.shellMods.get(s.id);
        m ? (he.set(d, m[0]), ce.set(d, m[1])) : c.deckSecs.has(s.id) && (he.set(d, 1), ce.set(d, 0));
      }
      if (o.elementInputs.val = {
        elasticities: t,
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
        poissonsRatios: U,
        thicknesses: se,
        membraneModifiers: he,
        bendingModifiers: ce,
        shellModifiers: Ie,
        shellSurfaceLoads: me,
        shellAngles: ae,
        cargaDeArea: ie,
        cantos: F,
        anchos: I,
        sectionShapes: u,
        localAngles: $,
        shearAreasY: j,
        shearAreasZ: _,
        momentReleases: v,
        endOffsets: W,
        plateFormulations: P,
        deckSections: Z,
        frameLoads: J,
        frameLoadsPorPatron: (() => {
          const s = {
            Dead: J
          }, d = /* @__PURE__ */ new Map();
          x.forEach((M, i) => {
            if (M.length === 2) {
              const p = c.frames.find((m) => S.get(m.nI) === M[0] && S.get(m.nJ) === M[1]);
              p && d.set(p.id, i);
            }
          });
          for (const [M, i] of c.frameLoadsPat) {
            const p = /* @__PURE__ */ new Map();
            for (const [m, g] of i) {
              const h = d.get(m);
              h !== void 0 && p.set(h, g);
            }
            s[M] = p;
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
          nodes: s.pts.map((d) => S.get(d)).filter((d) => d !== void 0),
          cells: s.cells.map((d) => B.get(d)).filter((d) => d !== void 0),
          q: s.cells.map((d) => c.shellLoads.get(d)).find((d) => d !== void 0),
          ang: s.cells.map((d) => c.shellAngles.get(d)).find((d) => d !== void 0)
        })).filter((s) => s.nodes.length === 4 && s.cells.length > 0)
      }, c.doSolve && ee.length > 0 && ee.length === x.length && oe.length === 0) try {
        const s = t.get(ee[0]) ?? 25e6, d = U.get(ee[0]) ?? 0.2;
        ee.some((g) => Math.abs((t.get(g) ?? s) - s) > 1e-9 * s || Math.abs((U.get(g) ?? d) - d) > 1e-12) && c.errors.push("hex: hex8Solve lleva UN material; los solidos tienen E o nu distintos y se usa el del primero");
        const M = /* @__PURE__ */ new Map();
        for (const [g, h] of o.nodeInputs.val.supports ?? []) M.set(g, [
          !!h[0],
          !!h[1],
          !!h[2]
        ]);
        const i = /* @__PURE__ */ new Map();
        for (const [g, h] of Je({
          Dead: R,
          ...Object.fromEntries(te)
        })) i.set(g, [
          h[0] ?? 0,
          h[1] ?? 0,
          h[2] ?? 0
        ]);
        const p = Ge({
          nodes: O,
          elements: x,
          E: s,
          nu: d,
          supports: M,
          loads: i,
          incompatible: c.solidIncompatible
        }), m = /* @__PURE__ */ new Map();
        p.displacements.forEach(([g, h, k], E) => m.set(E, [
          g,
          h,
          k,
          0,
          0,
          0
        ])), o.deformOutputs.val = {
          deformations: m,
          reactions: /* @__PURE__ */ new Map()
        }, o.analyzeOutputs.val = {
          solidStress: p.stressPerElement,
          solidVonMises: p.vonMisesPerElement
        }, console.log(`[CLI Modeler] Solve OK \u2014 ${x.length} solidos H8, ${O.length} nodos (${p.elapsedMs.toFixed(0)} ms)`);
      } catch (s) {
        c.errors.push(`hex8Solve: ${(s == null ? void 0 : s.message) ?? s}`);
      }
      else if (c.doSolve && O.length && x.length) try {
        window.__hekatanCliSprings = oe;
        const s = Je({
          Dead: R,
          ...Object.fromEntries(te)
        });
        o.deformOutputs.val = Ke(O, x, {
          ...o.nodeInputs.val,
          loads: s
        }, o.elementInputs.val, oe.length ? oe : void 0);
        try {
          o.analyzeOutputs.val = Ze(O, x, o.elementInputs.val, o.deformOutputs.val);
        } catch (d) {
          console.warn("[CLI Modeler] analyze:", (d == null ? void 0 : d.message) ?? d);
        }
        if (c.areaSprings.length > 0) try {
          const d = o.deformOutputs.val.deformations, M = o.analyzeOutputs.val ?? {}, i = M.pressure instanceof Map ? M.pressure : /* @__PURE__ */ new Map();
          let p = 0, m = 0;
          for (const g of c.areaSprings) {
            const h = B.get(g.id);
            if (h === void 0) continue;
            const E = x[h].map((b) => {
              var _a2;
              const y = ((_a2 = d.get(b)) == null ? void 0 : _a2[2]) ?? 0, C = g.ks * y;
              return C < p && (p = C), C > m && (m = C), C;
            });
            i.set(h, E);
          }
          i.size > 0 && (M.pressure = i, M.colorMapRanges = {
            ...M.colorMapRanges ?? {},
            pressure: [
              m,
              p
            ]
          }, o.analyzeOutputs.val = M, console.log(`[CLI Modeler] presi\xF3n Winkler: ${i.size} shells, \u03C3 ${p.toFixed(0)}..${m.toFixed(0)} kN/m\xB2`));
        } catch (d) {
          console.warn("[CLI Modeler] presi\xF3n:", (d == null ? void 0 : d.message) ?? d);
        }
        if (ee.length > 0) try {
          const d = o.deformOutputs.val.deformations, M = /* @__PURE__ */ new Map(), i = /* @__PURE__ */ new Map();
          for (const p of ee) {
            const m = x[p], g = m.map((E) => O[E]), h = m.flatMap((E) => {
              const b = d.get(E) ?? [
                0,
                0,
                0
              ];
              return [
                b[0],
                b[1],
                b[2]
              ];
            }), k = Ve(g, t.get(p) ?? 25e6, U.get(p) ?? 0.2, h, c.solidIncompatible);
            M.set(p, k.stress), i.set(p, k.vonMises);
          }
          o.analyzeOutputs.val = {
            ...o.analyzeOutputs.val ?? {},
            solidStress: M,
            solidVonMises: i
          };
        } catch (d) {
          console.warn("[CLI Modeler] tensiones de solidos:", (d == null ? void 0 : d.message) ?? d);
        }
        console.log("[CLI Modeler] Solve OK \u2014", x.length, "elementos,", O.length, "nodos");
      } catch (s) {
        c.errors.push(`solve fall\xF3: ${s.message}`);
      }
      if (o.objects3D.val = [], c.errors.length) {
        console.warn("[CLI Modeler] Errores:");
        for (const s of c.errors) console.warn("  -", s);
      }
      window.__hekatanCliErrors = c.errors;
      let de = 0, we = 0;
      const G = o.deformOutputs.val;
      if ((_a = G == null ? void 0 : G.deformations) == null ? void 0 : _a.size) for (const [, s] of G.deformations) Math.abs(s[2]) > Math.abs(de) && (de = s[2]);
      if ((_b = G == null ? void 0 : G.reactions) == null ? void 0 : _b.size) for (const [, s] of G.reactions) we += s[2] || 0;
      window.__hekatanCliVista = c.vista ?? null, window.__hekatanCliStats = {
        nodes: O.length,
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
  ls as c,
  Qe as p
};
