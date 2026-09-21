import { i as qe, t as Pe, c as _e, d as Be, a as Ue, b as Ye } from "./cadSections-BcRFaG1j.js";
import { c as je } from "./cargasPorCaso-B_GZ_-rO.js";
import { h as Ge, a as Ze, __tla as __tla_0 } from "./h8-CObNaegA.js";
import { a as Ve } from "./analyze-C-HJ03ae.js";
import { m as He, d as Ke, __tla as __tla_1 } from "./didacticCpp-CzlDWovh.js";
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
  function Xe(d) {
    const t = d.toLowerCase().trim();
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
    if (c.length > 1 && c.length <= 6 && c.every(($) => $ === "0" || $ === "1")) return c.forEach(($, B) => {
      J[B] = $ === "1";
    }), J;
    for (const $ of c) Oe[$] !== void 0 && (J[Oe[$]] = true);
    if (/^[01]+$/.test(t) && t.length <= 6) for (let $ = 0; $ < t.length; $++) J[$] = t[$] === "1";
    return J;
  }
  Qe = function(d) {
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
    let J = null, c = 0, $ = 0, B = 0;
    const D = d.split(/\r?\n/);
    for (let U = 0; U < D.length; U++) {
      let k = D[U].trim();
      if (!k || k.startsWith("#") || k.startsWith("//")) continue;
      k = k.replace(/[;]+$/, "");
      const o = k.split(/\s+/), z = o[0].toLowerCase();
      if (z === "nodes" && o.length === 1) {
        J = "nodes";
        continue;
      }
      if ((z === "elements" || z === "frames") && o.length === 1) {
        J = "elements";
        continue;
      }
      if (z === "areas" && o.length === 1) {
        J = "areas";
        continue;
      }
      if (z === "supports" && o.length === 1) {
        J = "supports";
        continue;
      }
      if (z === "loads" && o.length === 1) {
        J = "loads";
        continue;
      }
      if (z === "springs" && o.length === 1) {
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
          $++, t.frames.push({
            id: $,
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
        t.supports.set(e, Xe(n));
        continue;
      }
      J && !/^[\-\d]/.test(o[0]) && (J = null);
      try {
        switch (z) {
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
            const e = parseInt(o[1], 10), n = parseInt(o[2], 10), a = parseInt(o[3], 10), r = parseFloat(o[4] ?? "25e6"), l = parseFloat(o[5] ?? "0.16"), F = parseFloat(o[6] ?? "0.001"), v = o[7] !== void 0 ? parseFloat(o[7]) : void 0, h = o[8] !== void 0 ? parseFloat(o[8]) : void 0, y = o[9] !== void 0 ? parseFloat(o[9]) : void 0, I = o[10] !== void 0 ? parseFloat(o[10]) : void 0, X = o[11] !== void 0 ? parseFloat(o[11]) : void 0, W = o[12] !== void 0 ? parseFloat(o[12]) : void 0, V = o.indexOf("#"), j = V >= 0 && o[V + 1] ? o[V + 1] : void 0;
            t.frames.push({
              id: e,
              nI: n,
              nJ: a,
              E: r,
              A: l,
              I: F,
              Iy: v,
              J: h,
              nu: y,
              rho: I,
              D: X,
              B: W,
              sec: j
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
            const e = parseInt(o[1], 10), n = o.slice(2, 8).map((y) => parseFloat(y)), [a, r, l, F] = n, v = isFinite(n[4]) ? n[4] : r, h = isFinite(n[5]) ? n[5] : l;
            isFinite(e) && a > 0 && r > 0 && l > 0 && F > 0 && v > 0 && h > 0 && l + h < a && F < Math.min(r, v) ? t.frameISec.set(e, {
              d: a,
              bf: r,
              tf: l,
              tw: F,
              t2b: v,
              tfb: h
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
            const e = parseInt(o[1], 10), [n, a, r, l, F] = o.slice(2, 7).map((h) => parseFloat(h)), v = (a - (F || 0)) / 2;
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
            const e = parseInt(o[1], 10), n = o.slice(2).map((W) => parseFloat(W)), a = n.length >= 5 && n[3] < 1 && n[4] >= 1, r = n[0], l = n[1], F = n[2], v = a ? n[3] : n[2], h = a ? 4 : 3, y = isFinite(n[h]) ? n[h] : 25e6, I = isFinite(n[h + 1]) ? n[h + 1] : 0.2, X = isFinite(n[h + 2]) ? n[h + 2] : 2.4;
            isFinite(e) && r > 0 && l > 0 && F > 0 && v > 0 && v < r / 2 && F < l / 2 && y > 0 ? t.frameCft.set(e, {
              b: r,
              h: l,
              t: F,
              tw: v,
              Ec: y,
              nuC: I,
              rhoC: X >= 0 ? X : 2.4
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
            t.edgeEtabs = e === "etabs" || e === "1" || e === "on" || e === "si" || e === "hermite", t.edgeLineal = e === "lineal" || e === "linear" || e === "safe" || e === "sap" || e === "linea", t.edgeLineal && (t.edgeEtabs = true);
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
            if (n === "thin" || n === "delgada" || n === "kirchhoff" || n === "1" ? a = 1 : n === "thick" || n === "gruesa" || n === "mindlin" || n === "0" ? a = 0 : n === "dkmq" || n === "3" ? a = 3 : (n === "wilson" || n === "dse" || n === "4") && (a = 4), a === void 0) {
              t.errors.push(`shelltype ${e}: se esperaba thin, thick, dkmq o wilson`);
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
            const [n, a, r, l, F, v, h] = e, y = [];
            for (let I = v; I <= h; I++) y.push(I);
            t.areaObjs.push({
              id: n,
              pts: [
                a,
                r,
                l,
                F
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
            const e = parseInt(o[1], 10), n = o.findIndex((r, l) => l >= 2 && r.startsWith("#")), a = o.slice(2, n < 0 ? void 0 : n).join(" ");
            t.supports.set(e, Xe(a));
            break;
          }
          case "load":
          case "l": {
            const e = parseInt(o[1], 10), n = parseFloat(o[2] ?? "0"), a = parseFloat(o[3] ?? "0"), r = parseFloat(o[4] ?? "0"), l = parseFloat(o[5] ?? "0"), F = parseFloat(o[6] ?? "0"), v = parseFloat(o[7] ?? "0"), h = o[8] && isNaN(parseFloat(o[8])) ? o[8] : "Dead";
            /^dead$/i.test(h) ? t.loads.set(e, [
              n,
              a,
              r,
              l,
              F,
              v
            ]) : (t.loadsPat.has(h) || t.loadsPat.set(h, /* @__PURE__ */ new Map()), t.loadsPat.get(h).set(e, [
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
            t.errors.push(`L${U + 1}: comando desconocido "${z}"`);
        }
      } catch (e) {
        t.errors.push(`L${U + 1}: error "${k}" \u2014 ${e.message}`);
      }
    }
    return t;
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
`, Z = (d, t) => [
    d[0] - t[0],
    d[1] - t[1],
    d[2] - t[2]
  ], fe = (d, t) => d[0] * t[0] + d[1] * t[1] + d[2] * t[2], Fe = (d, t) => [
    d[1] * t[2] - d[2] * t[1],
    d[2] * t[0] - d[0] * t[2],
    d[0] * t[1] - d[1] * t[0]
  ], K = (d) => Math.hypot(d[0], d[1], d[2]), ie = (d, t) => [
    d[0] * t,
    d[1] * t,
    d[2] * t
  ];
  function Re(d, t) {
    const J = d.shellModsDir.get(t);
    return !!J && Math.abs(J[3]) < 1e-12 && Math.abs(J[4]) < 1e-12 && Math.abs(J[5]) < 1e-12;
  }
  function ss(d, t = 200, J) {
    const c = [
      0,
      1,
      2
    ].map((h) => (d[0][h] + d[1][h] + d[2][h] + d[3][h]) / 4);
    let $ = Z(d[1], d[0]), B = Fe($, Z(d[3], d[0]));
    B = ie(B, 1 / K(B)), $ = ie($, 1 / K($));
    const D = Fe(B, $), U = d.map((h) => [
      fe(Z(h, c), $),
      fe(Z(h, c), D)
    ]);
    let k = [
      0,
      1,
      2,
      3
    ];
    if (J) {
      const h = [
        0,
        1,
        2,
        3
      ].map((y) => {
        const I = Z(d[(y + 1) % 4], d[y]);
        return Math.abs(fe(I, J)) / K(I);
      });
      k = [
        0,
        1,
        2,
        3
      ].sort((y, I) => h[y] - h[I]).slice(0, 2);
    }
    const o = U.map((h) => h[0]), z = U.map((h) => h[1]), e = Math.min(...o), n = Math.max(...o), a = Math.min(...z), r = Math.max(...z), l = [
      0,
      1,
      2,
      3
    ].map(() => ({
      pts: [],
      dA: 0
    }));
    let F = 0;
    for (let h = 0; h < t; h++) for (let y = 0; y < t; y++) {
      const I = e + (n - e) * (h + 0.5) / t, X = a + (r - a) * (y + 0.5) / t;
      let W = 0, V = 0;
      for (let P = 0; P < 4; P++) {
        const Y = U[P], se = U[(P + 1) % 4];
        (se[0] - Y[0]) * (X - Y[1]) - (se[1] - Y[1]) * (I - Y[0]) >= 0 ? W++ : V++;
      }
      if (W !== 4 && V !== 4) continue;
      let j = k[0], R = 1 / 0;
      for (const P of k) {
        const Y = U[P], se = U[(P + 1) % 4], oe = se[0] - Y[0], _ = se[1] - Y[1], pe = oe * oe + _ * _, ce = Math.max(0, Math.min(1, ((I - Y[0]) * oe + (X - Y[1]) * _) / pe)), te = Math.hypot(I - (Y[0] + ce * oe), X - (Y[1] + ce * _));
        te < R && (R = te, j = P);
      }
      l[j].pts.push([
        c[0] + I * $[0] + X * D[0],
        c[1] + I * $[1] + X * D[1],
        c[2] + I * $[2] + X * D[2]
      ]), F++;
    }
    const v = 0.5 * K(Fe(Z(d[2], d[0]), Z(d[3], d[1])));
    for (const h of l) h.dA = F ? v / F : 0;
    return l;
  }
  function ts(d, t) {
    if (!(t > 0)) return;
    const J = 1e-6, c = (z) => d.nodes.get(z);
    let $ = Math.max(0, ...d.nodes.keys()) + 1, B = d.shells.reduce((z, e) => Math.max(z, e.id), 0) + 1;
    const D = (z) => {
      for (const [n, a] of d.nodes) if (K(Z(a, z)) < J) return n;
      const e = $++;
      return d.nodes.set(e, [
        z[0],
        z[1],
        z[2]
      ]), e;
    }, U = (z, e) => {
      const n = d.shellModsDir.get(z);
      n && d.shellModsDir.set(e, [
        ...n
      ]);
      const a = d.shellMods.get(z);
      a && d.shellMods.set(e, [
        ...a
      ]);
      const r = d.shellLoads.get(z);
      r !== void 0 && d.shellLoads.set(e, r);
      const l = d.shellTypes.get(z);
      l !== void 0 && d.shellTypes.set(e, l);
      const F = d.shellAngles.get(z);
      F !== void 0 && d.shellAngles.set(e, F);
    }, k = [];
    let o = 0;
    for (const z of d.shells) {
      if (z.pts.length !== 4) {
        k.push(z);
        continue;
      }
      const e = z.pts.map(c);
      if (e.some((h) => !h)) {
        k.push(z);
        continue;
      }
      const n = (K(Z(e[1], e[0])) + K(Z(e[2], e[3]))) / 2, a = (K(Z(e[3], e[0])) + K(Z(e[2], e[1]))) / 2, r = Math.max(1, Math.ceil(n / t - 1e-9)), l = Math.max(1, Math.ceil(a / t - 1e-9));
      if (r === 1 && l === 1) {
        k.push(z);
        continue;
      }
      const F = (h, y) => [
        0,
        1,
        2
      ].map((I) => e[0][I] * (1 - h) * (1 - y) + e[1][I] * h * (1 - y) + e[2][I] * h * y + e[3][I] * (1 - h) * y), v = [];
      for (let h = 0; h <= r; h++) {
        const y = [];
        for (let I = 0; I <= l; I++) y.push(D(F(h / r, I / l)));
        v.push(y);
      }
      for (let h = 0; h < r; h++) for (let y = 0; y < l; y++) {
        const I = h === 0 && y === 0 ? z.id : B++;
        k.push({
          ...z,
          id: I,
          pts: [
            v[h][y],
            v[h + 1][y],
            v[h + 1][y + 1],
            v[h][y + 1]
          ]
        }), I !== z.id && U(z.id, I);
      }
      o++;
    }
    o && (d.shells = k, console.log(`[CLI Modeler] automesh ${t} m: ${o} pano(s) partido(s) -> ${d.shells.length} cascaras, ${d.nodes.size} nudos`));
  }
  function os(d) {
    const J = (a) => d.nodes.get(a), c = [
      ...d.nodes.keys()
    ], $ = (a, r, l) => {
      const F = Z(r, a), v = K(F), h = ie(F, 1 / v), y = [];
      for (const I of c) {
        if (l.includes(I)) continue;
        const X = Z(J(I), a), W = fe(X, h);
        W > 1e-6 && W < v - 1e-6 && K(Z(X, ie(h, W))) < 1e-4 && y.push(W / v);
      }
      return y.sort((I, X) => I - X);
    }, B = (a, r) => {
      const l = [];
      for (const F of a) r.some((v) => Math.abs(F - v) < 1e-5) && !l.some((v) => Math.abs(F - v) < 1e-5) && l.push(F);
      return l;
    }, D = (a) => {
      for (const r of c) if (K(Z(J(r), a)) < 1e-4) return r;
    };
    let U = d.shells.reduce((a, r) => Math.max(a, r.id), 0) + 1;
    const k = [], o = (a, r) => {
      const l = d.shellModsDir.get(a);
      l && d.shellModsDir.set(r, [
        ...l
      ]);
      const F = d.shellMods.get(a);
      F && d.shellMods.set(r, [
        ...F
      ]);
      const v = d.shellLoads.get(a);
      v !== void 0 && d.shellLoads.set(r, v);
      const h = d.shellTypes.get(a);
      h !== void 0 && d.shellTypes.set(r, h);
      const y = d.shellAngles.get(a);
      y !== void 0 && d.shellAngles.set(r, y);
    };
    for (const a of d.shells) {
      if (!Re(d, a.id) || a.pts.length !== 4 || a.pts.some((j) => !d.nodes.has(j))) {
        k.push(a);
        continue;
      }
      const r = a.pts.map(J), l = $(r[0], r[1], a.pts), F = $(r[2], r[3], a.pts).map((j) => 1 - j), v = $(r[1], r[2], a.pts), h = $(r[3], r[0], a.pts).map((j) => 1 - j);
      let y = [
        0,
        ...B(l, F),
        1
      ], I = [
        0,
        ...B(v, h),
        1
      ];
      if (y.length === 2 && I.length === 2) {
        k.push(a);
        continue;
      }
      const X = (j, R) => [
        0,
        1,
        2
      ].map((P) => (1 - j) * (1 - R) * r[0][P] + j * (1 - R) * r[1][P] + j * R * r[2][P] + (1 - j) * R * r[3][P]);
      let W = I.map((j) => y.map((R) => D(X(R, j))));
      if (W.some((j) => j.some((R) => R === void 0)) && (y.length >= I.length ? I = [
        0,
        1
      ] : y = [
        0,
        1
      ], W = I.map((j) => y.map((R) => D(X(R, j)))), W.some((j) => j.some((R) => R === void 0)))) {
        k.push(a);
        continue;
      }
      let V = true;
      for (let j = 0; j < I.length - 1; j++) for (let R = 0; R < y.length - 1; R++) {
        const P = [
          W[j][R],
          W[j][R + 1],
          W[j + 1][R + 1],
          W[j + 1][R]
        ], Y = V ? a.id : U++;
        V || o(a.id, Y), V = false, k.push({
          id: Y,
          pts: P,
          t: a.t,
          E: a.E,
          rho: a.rho
        });
      }
    }
    d.shells = k;
    const z = 9.80665, e = (a, r) => {
      const l = d.loads.get(a) ?? [
        0,
        0,
        0,
        0,
        0,
        0
      ];
      d.loads.set(a, [
        l[0] + r[0],
        l[1] + r[1],
        l[2] + r[2],
        l[3] + r[3],
        l[4] + r[4],
        l[5] + r[5]
      ]);
    }, n = (a, r) => {
      const l = Z(r, a), F = K(l), v = ie(l, 1 / F);
      return d.frames.filter((h) => [
        h.nI,
        h.nJ
      ].every((y) => {
        const I = d.nodes.get(y);
        if (!I) return false;
        const X = Z(I, a), W = fe(X, v);
        return W > -1e-4 && W < F + 1e-4 && K(Z(X, ie(v, W))) < 1e-4;
      }));
    };
    for (const a of d.shells) {
      if (!Re(d, a.id) || a.pts.length !== 4) continue;
      const r = d.selfWeight ? (a.rho ?? 2.45) * a.t * z * d.selfWeight : 0, l = d.shellLoads.get(a.id) ?? 0, F = -r + l;
      if (Math.abs(F) < 1e-15) continue;
      const v = a.pts.map(J);
      let h;
      if (d.deckOneWay) {
        const I = Z(v[1], v[0]);
        let X = Fe(I, Z(v[3], v[0]));
        X = ie(X, 1 / K(X));
        const W = ie(I, 1 / K(I)), V = Fe(X, W), j = (d.shellAngles.get(a.id) ?? 0) * Math.PI / 180;
        h = [
          0,
          1,
          2
        ].map((R) => Math.cos(j) * W[R] + Math.sin(j) * V[R]);
      }
      const y = ss(v, 200, h);
      for (let I = 0; I < 4; I++) {
        const { pts: X, dA: W } = y[I];
        if (!X.length) continue;
        const V = v[I], j = v[(I + 1) % 4], R = n(V, j);
        if (!R.length) {
          const _ = F * W * X.length;
          e(a.pts[I], [
            0,
            0,
            _ / 2,
            0,
            0,
            0
          ]), e(a.pts[(I + 1) % 4], [
            0,
            0,
            _ / 2,
            0,
            0,
            0
          ]);
          continue;
        }
        const P = Z(j, V), Y = K(P), se = ie(P, 1 / Y), oe = X.map((_) => fe(Z(_, V), se));
        for (const _ of R) {
          const pe = J(_.nI), ce = J(_.nJ), te = fe(Z(pe, V), se), be = fe(Z(ce, V), se), Me = Math.min(te, be), le = Math.max(te, be), Q = le - Me;
          if (Q < 1e-9) continue;
          const Ce = le >= Y - 1e-6, ne = ie(Z(ce, pe), 1 / Q), ee = Fe(ne, [
            0,
            0,
            1
          ]);
          let he = 0, re = 0, Ie = 0, ue = 0;
          for (const de of oe) {
            if (de < Me - 1e-9 || (Ce ? de > le + 1e-9 : de >= le - 1e-9)) continue;
            let we = de - Me;
            te > be && (we = Q - we);
            const G = we / Q;
            he += 1 - 3 * G * G + 2 * G * G * G, re += Q * (G - 2 * G * G + G * G * G), Ie += 3 * G * G - 2 * G * G * G, ue += Q * (-G * G + G * G * G);
          }
          const ae = F * W;
          e(_.nI, [
            0,
            0,
            ae * he,
            ee[0] * ae * re,
            ee[1] * ae * re,
            ee[2] * ae * re
          ]), e(_.nJ, [
            0,
            0,
            ae * Ie,
            ee[0] * ae * ue,
            ee[1] * ae * ue,
            ee[2] * ae * ue
          ]);
        }
      }
      d.deckTributario.add(a.id), d.shellLoads.delete(a.id);
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
      "displacementZ",
      "vonMises",
      "bendingXX",
      "bendingYY",
      "membraneXX"
    ],
    params: {},
    hasModal: true,
    runModal(d, t, J) {
      var _a;
      const c = t.nodes.val, $ = t.elements.val;
      if (!(!c.length || !$.length)) try {
        const B = Math.max(1, parseInt(window.__hekatanCliModalModes ?? "12", 10) || 12), D = t.nodeInputs.val, U = window.__hekatanCliSprings, k = He(c, $, D, t.elementInputs.val, B, 0, 0, 1, (D == null ? void 0 : D.diaphragms) instanceof Map && D.diaphragms.size ? D.diaphragms : void 0, U && U.length ? U : void 0);
        console.log(`[CLI Modeler] Modal OK \u2014 ${k.frequencies.length} modos, T1 = ${k.frequencies[0] ? (1 / k.frequencies[0]).toFixed(5) : "\u2014"} s`), (_a = J == null ? void 0 : J.render) == null ? void 0 : _a.call(J, k, {
          title: "Modal del .heks (masa 3D, como SAP2000)"
        });
      } catch (B) {
        console.error("[CLI Modeler] modal:", (B == null ? void 0 : B.message) ?? B);
      }
    },
    build(d, t) {
      var _a, _b;
      const J = window.__hekatanCliScript ?? es;
      window.__hekatanCliLastScript = J;
      const c = Qe(J);
      c.autoMesh > 0 && ts(c, c.autoMesh), c.deckEtabs && os(c);
      const $ = /* @__PURE__ */ new Map(), B = /* @__PURE__ */ new Map(), D = [], U = Array.from(c.nodes.keys()).sort((s, f) => s - f);
      for (const s of U) $.set(s, D.length), D.push(c.nodes.get(s));
      const k = [], o = /* @__PURE__ */ new Map(), z = /* @__PURE__ */ new Map(), e = /* @__PURE__ */ new Map(), n = /* @__PURE__ */ new Map(), a = /* @__PURE__ */ new Map(), r = /* @__PURE__ */ new Map(), l = /* @__PURE__ */ new Map(), F = /* @__PURE__ */ new Map(), v = /* @__PURE__ */ new Map(), h = /* @__PURE__ */ new Map(), y = /* @__PURE__ */ new Map(), I = /* @__PURE__ */ new Map(), X = /* @__PURE__ */ new Map(), W = /* @__PURE__ */ new Map(), V = /* @__PURE__ */ new Map(), j = /* @__PURE__ */ new Map(), R = /* @__PURE__ */ new Map(), P = /* @__PURE__ */ new Map(), Y = /* @__PURE__ */ new Map(), se = /* @__PURE__ */ new Map();
      for (const s of c.frames) {
        const f = $.get(s.nI), M = $.get(s.nJ);
        if (f === void 0 || M === void 0) {
          const b = U.length ? `IDs disponibles: ${U.join(", ")}` : "ning\xFAn nodo definido", C = [];
          f === void 0 && C.push(s.nI), M === void 0 && C.push(s.nJ), c.errors.push(`frame ${s.id}: nodo(s) inexistente(s) [${C.join(", ")}] \u2014 ${b}`);
          continue;
        }
        const i = k.length;
        k.push([
          f,
          M
        ]);
        const p = s.nu ?? 0.2;
        o.set(i, s.E), z.set(i, s.E / (2 * (1 + p))), e.set(i, s.A), n.set(i, s.I), a.set(i, s.Iy ?? s.I), r.set(i, s.J ?? 0.14 * Math.pow(Math.sqrt(s.A), 4)), l.set(i, s.rho ?? 2.45), Y.set(i, p), s.D !== void 0 && isFinite(s.D) && F.set(i, s.D), s.B !== void 0 && isFinite(s.B) && v.set(i, s.B);
        const u = c.frameAngles.get(s.id);
        u !== void 0 && isFinite(u) && y.set(i, u);
        const w = c.frameReleases.get(s.id);
        w && I.set(i, w);
        const m = c.frameEndOffsets.get(s.id);
        m && X.set(i, m);
        const A = c.frameLoads.get(s.id);
        A && j.set(i, A);
        const O = c.frameShearAreas.get(s.id);
        if (O && (P.set(i, O[0]), R.set(i, O[1])), s.sec || s.D !== void 0 && s.B !== void 0) {
          const b = {
            type: "general"
          };
          s.sec && (b.name = s.sec), s.D !== void 0 && isFinite(s.D) && (b.h = s.D), s.B !== void 0 && isFinite(s.B) && (b.b = s.B), h.set(i, b);
        }
        const g = c.frameISec.get(s.id);
        if (g) {
          const b = qe(g.d, g.bf, g.tf, g.tw, g.t2b, g.tfb);
          e.set(i, b.A), a.set(i, b.Iz), n.set(i, b.Iy), r.set(i, b.J), P.set(i, b.As2), R.set(i, b.As3), F.set(i, g.d), v.set(i, Math.max(g.bf, g.t2b));
          const C = (N) => Math.round(N * 1e4) / 10;
          h.set(i, {
            type: "I",
            h: g.d,
            b: g.bf,
            tf: g.tf,
            tw: g.tw,
            t2b: g.t2b,
            tfb: g.tfb,
            name: s.sec ?? `I${C(g.d)}X${C(g.bf)}X${C(g.tf)}X${C(g.tw)}`
          });
        }
        const x = c.frameTube.get(s.id);
        if (x) {
          const b = Pe(x.b, x.h, x.tf, x.tw);
          e.set(i, b.A), a.set(i, b.Iz), n.set(i, b.Iy), r.set(i, b.J), P.set(i, b.As2), R.set(i, b.As3), F.set(i, x.h), v.set(i, x.b);
          const C = (N) => Math.round(N * 1e4) / 10;
          h.set(i, {
            type: "HSS",
            h: x.h,
            b: x.b,
            tf: x.tf,
            tw: x.tw,
            name: s.sec ?? `TUBO${C(x.h)}X${C(x.b)}X${C(x.tf)}X${C(x.tw)}`
          });
        }
        const E = c.frameCanal.get(s.id);
        if (E) {
          const b = _e(E.d, E.bf, E.tf, E.tw);
          e.set(i, b.A), a.set(i, b.Iz), n.set(i, b.Iy), r.set(i, b.J), P.set(i, b.As2), R.set(i, b.As3), F.set(i, E.d), v.set(i, E.bf);
          const C = (N) => Math.round(N * 1e4) / 10;
          h.set(i, {
            type: "C",
            h: E.d,
            b: E.bf,
            tf: E.tf,
            tw: E.tw,
            name: s.sec ?? `C${C(E.d)}X${C(E.bf)}X${C(E.tf)}X${C(E.tw)}`
          });
        }
        const T = c.frameDosL.get(s.id);
        if (T) {
          const b = Be(T.d, T.t2, T.tf, T.tw, T.dis);
          e.set(i, b.A), a.set(i, b.Iz), n.set(i, b.Iy), r.set(i, b.J), P.set(i, b.As2), R.set(i, b.As3), F.set(i, T.d), v.set(i, T.t2);
          const C = (N) => Math.round(N * 1e4) / 10;
          h.set(i, {
            type: "2L",
            h: T.d,
            b: T.t2,
            tf: T.tf,
            tw: T.tw,
            dis: T.dis,
            name: s.sec ?? `2L${C(T.d)}X${C(T.t2)}X${C(T.tf)}X${C(T.tw)}S${C(T.dis)}`
          });
        }
        const L = c.frameCftc.get(s.id);
        if (L) {
          const b = Ue(L.D, L.t, s.E, p, L.Ec, L.nuC);
          e.set(i, b.A), a.set(i, b.Iz), n.set(i, b.Iy), r.set(i, b.J), P.set(i, b.As2), R.set(i, b.As3), F.set(i, L.D), v.set(i, L.D);
          const C = L.D - 2 * L.t, N = Math.PI * C * C / 4, q = Math.PI * L.D * L.D / 4 - N;
          l.set(i, ((s.rho ?? 7.85) * q + L.rhoC * N) / b.A), h.set(i, {
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
          const b = Ye(S.b, S.h, S.t, s.E, p, S.Ec, S.nuC, S.tw);
          e.set(i, b.A), a.set(i, b.Iz), n.set(i, b.Iy), r.set(i, b.J), P.set(i, b.As2), R.set(i, b.As3), F.set(i, S.h), v.set(i, S.b);
          const C = (S.b - 2 * S.tw) * (S.h - 2 * S.t), N = S.b * S.h - C;
          l.set(i, ((s.rho ?? 7.85) * N + S.rhoC * C) / b.A);
          const q = (H) => Math.round(H * 1e3);
          h.set(i, {
            type: "CFT",
            b: S.b,
            h: S.h,
            tw: S.tw,
            tf: S.t,
            fillE: S.Ec,
            fillRho: S.rhoC,
            steelRho: s.rho ?? 7.85,
            name: s.sec ?? `CFT ${q(S.h)}X${q(S.b)}X${q(S.t)}${S.tw !== S.t ? `X${q(S.tw)}` : ""}`
          });
        }
      }
      if (c.meshCross) {
        const s = (w, m) => w[0] * m[0] + w[1] * m[1] + w[2] * m[2], f = [
          o,
          z,
          e,
          n,
          a,
          r,
          l,
          Y,
          F,
          v,
          y,
          R,
          P,
          h,
          j
        ], M = (w, m) => {
          for (const A of f) A.has(w) && A.set(m, A.get(w));
        }, i = (w) => {
          for (let m = 0; m < D.length; m++) if (Math.hypot(D[m][0] - w[0], D[m][1] - w[1], D[m][2] - w[2]) < 1e-6) return m;
          return D.push([
            w[0],
            w[1],
            w[2]
          ]), D.length - 1;
        }, p = (w) => {
          const m = D[w[0]], A = D[w[1]];
          return [
            Math.min(m[0], A[0]),
            Math.min(m[1], A[1]),
            Math.min(m[2], A[2]),
            Math.max(m[0], A[0]),
            Math.max(m[1], A[1]),
            Math.max(m[2], A[2])
          ];
        };
        let u = 0;
        for (let w = 0; w < k.length; w++) {
          if (k[w].length !== 2) continue;
          const m = p(k[w]);
          for (let A = w + 1; A < k.length; A++) {
            if (k[A].length !== 2) continue;
            const [O, g] = k[w], [x, E] = k[A];
            if (O === x || O === E || g === x || g === E) continue;
            const T = p(k[A]);
            if (m[0] > T[3] + 1e-6 || T[0] > m[3] + 1e-6 || m[1] > T[4] + 1e-6 || T[1] > m[4] + 1e-6 || m[2] > T[5] + 1e-6 || T[2] > m[5] + 1e-6) continue;
            const L = D[O], S = D[g], b = D[x], C = D[E], N = [
              S[0] - L[0],
              S[1] - L[1],
              S[2] - L[2]
            ], q = [
              C[0] - b[0],
              C[1] - b[1],
              C[2] - b[2]
            ], H = [
              L[0] - b[0],
              L[1] - b[1],
              L[2] - b[2]
            ], me = s(N, N), ye = s(N, q), $e = s(q, q), ze = s(N, H), Te = s(q, H), Ae = me * $e - ye * ye;
            if (Ae < 1e-10 * me * $e) continue;
            const ve = (ye * Te - $e * ze) / Ae, ke = (me * Te - ye * ze) / Ae;
            if (ve < 1e-6 || ve > 1 - 1e-6 || ke < 1e-6 || ke > 1 - 1e-6) continue;
            const Le = [
              L[0] + ve * N[0],
              L[1] + ve * N[1],
              L[2] + ve * N[2]
            ], Se = [
              b[0] + ke * q[0],
              b[1] + ke * q[1],
              b[2] + ke * q[2]
            ];
            if (Math.hypot(Le[0] - Se[0], Le[1] - Se[1], Le[2] - Se[2]) > 1e-6) continue;
            const Je = i(Le);
            for (const ge of [
              w,
              A
            ]) {
              const [We, Ne] = k[ge], Ee = k.length;
              k[ge] = [
                We,
                Je
              ], k.push([
                Je,
                Ne
              ]), M(ge, Ee);
              const De = I.get(ge);
              De && (I.set(ge, [
                ...De.slice(0, 6),
                ...Array(6).fill(false)
              ]), I.set(Ee, [
                ...Array(6).fill(false),
                ...De.slice(6)
              ]));
              const xe = X.get(ge);
              xe && (X.set(ge, [
                xe[0],
                0,
                xe[2]
              ]), X.set(Ee, [
                0,
                xe[1],
                xe[2]
              ]));
            }
            u++;
          }
        }
        u > 0 && console.log(`[CLI Modeler] ${u} cruces de barras partidos con nudo (como ETABS; meshcross 0 lo apaga)`);
      }
      for (const s of c.shells) {
        const f = s.pts.map((u) => $.get(u));
        if (f.some((u) => u === void 0)) {
          c.errors.push(`shell ${s.id}: algun nodo inexistente`);
          continue;
        }
        const M = k.length;
        B.set(s.id, M), k.push(f), o.set(M, s.E), z.set(M, s.E / (2 * 1.2)), se.set(M, s.t), l.set(M, s.rho ?? 2.45), Y.set(M, 0.2);
        const i = c.shellTypes.get(s.id);
        i !== void 0 && W.set(M, i);
        const p = c.deckSecs.get(s.id);
        if (p) {
          const u = p.tc + (p.sr > 0 ? p.hr * (p.wrt + p.wrb) / 2 / p.sr : 0);
          se.set(M, p.tc), l.set(M, ((s.rho ?? 2.45) * u + p.w / 9.80665) / p.tc), V.set(M, {
            ...p
          });
        }
      }
      const oe = /* @__PURE__ */ new Map();
      for (const [s, f] of c.supports.entries()) {
        const M = $.get(s);
        M !== void 0 && oe.set(M, f);
      }
      const _ = /* @__PURE__ */ new Map();
      for (const [s, f] of c.loads.entries()) {
        const M = $.get(s);
        M !== void 0 && _.set(M, [
          ...f
        ]);
      }
      const pe = /* @__PURE__ */ new Map();
      for (const [s, f] of c.diaphragms.entries()) {
        const M = $.get(s);
        M !== void 0 && pe.set(M, f);
      }
      const ce = /* @__PURE__ */ new Map();
      for (const [s, f] of c.masses.entries()) {
        const M = $.get(s);
        M !== void 0 && ce.set(M, f);
      }
      const te = /* @__PURE__ */ new Map();
      for (const [s, f] of c.loadsPat) {
        const M = /* @__PURE__ */ new Map();
        for (const [i, p] of f) {
          const u = $.get(i);
          u !== void 0 && M.set(u, [
            ...p
          ]);
        }
        te.set(s, M);
      }
      const be = {
        Dead: new Map([
          ..._
        ].map(([s, f]) => [
          s,
          [
            ...f
          ]
        ]))
      };
      for (const [s, f] of te) be[s] = new Map([
        ...f
      ].map(([M, i]) => [
        M,
        [
          ...i
        ]
      ]));
      const Me = [
        [
          c.frameLoads,
          _
        ]
      ];
      for (const [s, f] of c.frameLoadsPat) te.has(s) || te.set(s, /* @__PURE__ */ new Map()), Me.push([
        f,
        te.get(s)
      ]);
      for (const [s, f] of Me) if (s.size) {
        const M = (i, p) => {
          const u = f.get(i) ?? [
            0,
            0,
            0,
            0,
            0,
            0
          ];
          f.set(i, [
            u[0] + p[0],
            u[1] + p[1],
            u[2] + p[2],
            u[3] + p[3],
            u[4] + p[4],
            u[5] + p[5]
          ]);
        };
        for (const [i, p] of s.entries()) {
          const u = c.frames.find((S) => S.id === i);
          if (!u) {
            c.errors.push(`frameload ${i}: no existe esa barra`);
            continue;
          }
          const w = $.get(u.nI), m = $.get(u.nJ);
          if (w === void 0 || m === void 0) continue;
          const A = D[w], O = D[m], g = [
            O[0] - A[0],
            O[1] - A[1],
            O[2] - A[2]
          ], x = Math.hypot(g[0], g[1], g[2]);
          if (x < 1e-9) continue;
          const E = [
            g[0] / x,
            g[1] / x,
            g[2] / x
          ], T = x * x / 12, L = [
            E[1] * p[2] - E[2] * p[1],
            E[2] * p[0] - E[0] * p[2],
            E[0] * p[1] - E[1] * p[0]
          ];
          M(w, [
            p[0] * x / 2,
            p[1] * x / 2,
            p[2] * x / 2,
            T * L[0],
            T * L[1],
            T * L[2]
          ]), M(m, [
            p[0] * x / 2,
            p[1] * x / 2,
            p[2] * x / 2,
            -T * L[0],
            -T * L[1],
            -T * L[2]
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
        const f = c.shellLoads.get(s.id);
        if (!f || c.deckTributario.has(s.id)) continue;
        const M = s.pts.map((u) => $.get(u));
        if (M.some((u) => u === void 0)) {
          c.errors.push(`areaload ${s.id}: algun nodo inexistente`);
          continue;
        }
        const i = M.map((u) => D[u]), p = [
          0,
          0,
          0,
          0
        ];
        for (const [u, w] of Ce) {
          const m = [
            0.25 * (1 - u) * (1 - w),
            0.25 * (1 + u) * (1 - w),
            0.25 * (1 + u) * (1 + w),
            0.25 * (1 - u) * (1 + w)
          ], A = [
            -0.25 * (1 - w),
            0.25 * (1 - w),
            0.25 * (1 + w),
            -0.25 * (1 + w)
          ], O = [
            -0.25 * (1 - u),
            -0.25 * (1 + u),
            0.25 * (1 + u),
            0.25 * (1 - u)
          ], g = [
            0,
            1,
            2
          ].map((L) => A.reduce((S, b, C) => S + b * i[C][L], 0)), x = [
            0,
            1,
            2
          ].map((L) => O.reduce((S, b, C) => S + b * i[C][L], 0)), E = [
            g[1] * x[2] - g[2] * x[1],
            g[2] * x[0] - g[0] * x[2],
            g[0] * x[1] - g[1] * x[0]
          ], T = Math.hypot(E[0], E[1], E[2]);
          for (let L = 0; L < 4; L++) p[L] += m[L] * f * T;
        }
        for (let u = 0; u < 4; u++) {
          const w = M[u], m = _.get(w) ?? [
            0,
            0,
            0,
            0,
            0,
            0
          ];
          m[2] += p[u], _.set(w, m), le.set(w, (le.get(w) ?? 0) + p[u]);
        }
      }
      if (c.selfWeight) {
        const f = /* @__PURE__ */ new Set();
        for (const [i, p] of B) c.deckTributario.has(i) && f.add(p);
        const M = (i, p) => {
          const u = _.get(i) ?? [
            0,
            0,
            0,
            0,
            0,
            0
          ];
          u[2] += p, _.set(i, u);
        };
        k.forEach((i, p) => {
          const u = l.get(p) ?? 0;
          if (u && !f.has(p)) {
            if (i.length === 2) {
              const w = e.get(p) ?? 0, m = D[i[0]], A = D[i[1]], O = [
                A[0] - m[0],
                A[1] - m[1],
                A[2] - m[2]
              ];
              let g = Math.hypot(O[0], O[1], O[2]);
              const x = X.get(p);
              if (x) {
                const N = Math.hypot(O[0], O[1]);
                N > 1e-9 && Math.abs(Math.atan2(Math.abs(O[2]), N)) * 180 / Math.PI < 20 && (g = Math.max(g - x[0] - x[1], 0));
              }
              const E = Math.hypot(O[0], O[1], O[2]), T = -w * u * 9.80665 * c.selfWeight, L = [
                O[0] / E,
                O[1] / E,
                O[2] / E
              ], S = g * g / 12, b = [
                L[1] * T,
                -L[0] * T,
                0
              ], C = (N, q) => {
                const H = _.get(N) ?? [
                  0,
                  0,
                  0,
                  0,
                  0,
                  0
                ];
                _.set(N, [
                  H[0] + q[0],
                  H[1] + q[1],
                  H[2] + q[2],
                  H[3] + q[3],
                  H[4] + q[4],
                  H[5] + q[5]
                ]);
              };
              C(i[0], [
                0,
                0,
                T * g / 2,
                S * b[0],
                S * b[1],
                0
              ]), C(i[1], [
                0,
                0,
                T * g / 2,
                -S * b[0],
                -S * b[1],
                0
              ]);
            } else if (i.length === 4) {
              const w = se.get(p) ?? 0, m = i.map((g) => D[g]);
              let A = 0;
              for (let g = 1; g < 3; g++) {
                const x = [
                  m[g][0] - m[0][0],
                  m[g][1] - m[0][1],
                  m[g][2] - m[0][2]
                ], E = [
                  m[g + 1][0] - m[0][0],
                  m[g + 1][1] - m[0][1],
                  m[g + 1][2] - m[0][2]
                ], T = [
                  x[1] * E[2] - x[2] * E[1],
                  x[2] * E[0] - x[0] * E[2],
                  x[0] * E[1] - x[1] * E[0]
                ];
                A += Math.hypot(T[0], T[1], T[2]) / 2;
              }
              const O = A * w * u * 9.80665 * c.selfWeight;
              for (const g of i) M(g, -O / 4);
            }
          }
        });
      }
      const ne = [];
      for (const s of c.springs) {
        const f = $.get(s.node);
        f !== void 0 && ne.push({
          node: f,
          dof: s.dof,
          k: s.k
        });
      }
      for (const s of c.areaSprings) {
        const f = B.get(s.id);
        if (f === void 0) {
          c.errors.push(`areaspring ${s.id}: no existe esa cascara`);
          continue;
        }
        ne.push({
          node: -(f + 1),
          dof: s.nodal ? -3 : -1,
          k: s.ks
        });
      }
      if (c.edgeEtabs) {
        const s = c.edgeLineal, f = s ? 1e-4 : 1e-6, M = /* @__PURE__ */ new Set(), i = [];
        k.forEach((u, w) => {
          if (u.length === 3 || u.length === 4) {
            i.push(w);
            for (const m of u) M.add(m);
          }
        });
        let p = 0;
        for (const u of i) {
          const w = k[u], m = w.map((O) => D[O]), A = [
            0,
            1,
            2
          ].map((O) => [
            Math.min(...m.map((g) => g[O])),
            Math.max(...m.map((g) => g[O]))
          ]);
          for (let O = 0; O < D.length; O++) {
            if (w.includes(O)) continue;
            const g = D[O], x = s ? f * Math.max(A[0][1] - A[0][0], A[1][1] - A[1][0], A[2][1] - A[2][0]) : 1e-6;
            if (g[0] < A[0][0] - x || g[0] > A[0][1] + x || g[1] < A[1][0] - x || g[1] > A[1][1] + x || g[2] < A[2][0] - x || g[2] > A[2][1] + x) continue;
            let E = false;
            for (let L = 0; L < w.length && !E; L++) {
              const S = m[L], b = m[(L + 1) % w.length], C = [
                b[0] - S[0],
                b[1] - S[1],
                b[2] - S[2]
              ], N = C[0] * C[0] + C[1] * C[1] + C[2] * C[2];
              if (N < 1e-24) continue;
              const q = [
                g[0] - S[0],
                g[1] - S[1],
                g[2] - S[2]
              ], H = (q[0] * C[0] + q[1] * C[1] + q[2] * C[2]) / N;
              if (H <= 1e-6 || H >= 1 - 1e-6) continue;
              const me = [
                q[0] - H * C[0],
                q[1] - H * C[1],
                q[2] - H * C[2]
              ];
              Math.hypot(me[0], me[1], me[2]) <= f * Math.sqrt(N) && (E = true);
            }
            !E || !(s || k.some((L, S) => S !== u && L.includes(O))) || (ne.push({
              node: -(u + 1),
              dof: s ? -4 : -2,
              k: O
            }), p++);
          }
        }
        p && console.log(`[CLI Modeler] edge ${s ? "lineal" : "etabs"}: ${p} nudo(s) colgado(s) atado(s) a su arista (${s ? "lineal" : "Hermite"})`);
      }
      const ee = [];
      for (const s of c.solids) {
        const f = s.pts.map((i) => $.get(i));
        if (f.some((i) => i === void 0)) {
          c.errors.push(`hex ${s.id}: algun nodo inexistente`);
          continue;
        }
        const M = k.length;
        k.push(f), o.set(M, s.E), Y.set(M, s.nu), z.set(M, s.E / (2 * (1 + s.nu))), l.set(M, s.rho), ee.push(M);
      }
      t.nodes.val = D, t.elements.val = k, t.nodeInputs.val = {
        supports: oe,
        loads: _,
        masses: ce,
        diaphragms: pe,
        cargasPorPatron: be,
        springs: ne
      }, t.springs && (t.springs.val = ne);
      const he = /* @__PURE__ */ new Map(), re = /* @__PURE__ */ new Map(), Ie = /* @__PURE__ */ new Map(), ue = /* @__PURE__ */ new Map(), ae = /* @__PURE__ */ new Map();
      for (const s of c.shells) {
        const f = B.get(s.id);
        if (f === void 0) continue;
        const M = c.shellLoads.get(s.id);
        M !== void 0 && ue.set(f, M);
        const i = c.shellAngles.get(s.id);
        i !== void 0 && ae.set(f, i);
        const p = c.shellModsDir.get(s.id);
        if (p) {
          Ie.set(f, p), he.set(f, (p[0] + p[1]) / 2), re.set(f, (p[3] + p[4]) / 2);
          continue;
        }
        const u = c.shellMods.get(s.id);
        u ? (he.set(f, u[0]), re.set(f, u[1])) : c.deckSecs.has(s.id) && (he.set(f, 1), re.set(f, 0));
      }
      if (t.elementInputs.val = {
        elasticities: o,
        shearModuli: z,
        areas: e,
        momentsOfInertiaY: n,
        momentsOfInertiaZ: a,
        torsionalConstants: c.torsionFactor !== 1 ? new Map([
          ...r
        ].map(([s, f]) => [
          s,
          f * c.torsionFactor
        ])) : r,
        densities: l,
        poissonsRatios: Y,
        thicknesses: se,
        membraneModifiers: he,
        bendingModifiers: re,
        shellModifiers: Ie,
        shellSurfaceLoads: ue,
        shellAngles: ae,
        cargaDeArea: le,
        cantos: F,
        anchos: v,
        sectionShapes: h,
        localAngles: y,
        shearAreasY: R,
        shearAreasZ: P,
        momentReleases: I,
        endOffsets: X,
        plateFormulations: W,
        deckSections: V,
        frameLoads: j,
        frameLoadsPorPatron: (() => {
          const s = {
            Dead: j
          }, f = /* @__PURE__ */ new Map();
          k.forEach((M, i) => {
            if (M.length === 2) {
              const p = c.frames.find((u) => $.get(u.nI) === M[0] && $.get(u.nJ) === M[1]);
              p && f.set(p.id, i);
            }
          });
          for (const [M, i] of c.frameLoadsPat) {
            const p = /* @__PURE__ */ new Map();
            for (const [u, w] of i) {
              const m = f.get(u);
              m !== void 0 && p.set(m, w);
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
          nodes: s.pts.map((f) => $.get(f)).filter((f) => f !== void 0),
          cells: s.cells.map((f) => B.get(f)).filter((f) => f !== void 0),
          q: s.cells.map((f) => c.shellLoads.get(f)).find((f) => f !== void 0),
          ang: s.cells.map((f) => c.shellAngles.get(f)).find((f) => f !== void 0)
        })).filter((s) => s.nodes.length === 4 && s.cells.length > 0)
      }, c.doSolve && ee.length > 0 && ee.length === k.length) try {
        const s = o.get(ee[0]) ?? 25e6, f = Y.get(ee[0]) ?? 0.2;
        ee.some((w) => Math.abs((o.get(w) ?? s) - s) > 1e-9 * s || Math.abs((Y.get(w) ?? f) - f) > 1e-12) && c.errors.push("hex: hex8Solve lleva UN material; los solidos tienen E o nu distintos y se usa el del primero");
        const M = /* @__PURE__ */ new Map();
        for (const [w, m] of t.nodeInputs.val.supports ?? []) M.set(w, [
          !!m[0],
          !!m[1],
          !!m[2]
        ]);
        const i = /* @__PURE__ */ new Map();
        for (const [w, m] of je({
          Dead: _,
          ...Object.fromEntries(te)
        })) i.set(w, [
          m[0] ?? 0,
          m[1] ?? 0,
          m[2] ?? 0
        ]);
        const p = Ge({
          nodes: D,
          elements: k,
          E: s,
          nu: f,
          supports: M,
          loads: i,
          incompatible: c.solidIncompatible
        }), u = /* @__PURE__ */ new Map();
        p.displacements.forEach(([w, m, A], O) => u.set(O, [
          w,
          m,
          A,
          0,
          0,
          0
        ])), t.deformOutputs.val = {
          deformations: u,
          reactions: /* @__PURE__ */ new Map()
        }, t.analyzeOutputs.val = {
          solidStress: p.stressPerElement,
          solidVonMises: p.vonMisesPerElement
        }, console.log(`[CLI Modeler] Solve OK \u2014 ${k.length} solidos H8, ${D.length} nodos (${p.elapsedMs.toFixed(0)} ms)`);
      } catch (s) {
        c.errors.push(`hex8Solve: ${(s == null ? void 0 : s.message) ?? s}`);
      }
      else if (c.doSolve && D.length && k.length) try {
        window.__hekatanCliSprings = ne;
        const s = je({
          Dead: _,
          ...Object.fromEntries(te)
        });
        t.deformOutputs.val = Ke(D, k, {
          ...t.nodeInputs.val,
          loads: s
        }, t.elementInputs.val, ne.length ? ne : void 0);
        try {
          t.analyzeOutputs.val = Ve(D, k, t.elementInputs.val, t.deformOutputs.val);
        } catch (f) {
          console.warn("[CLI Modeler] analyze:", (f == null ? void 0 : f.message) ?? f);
        }
        if (c.areaSprings.length > 0) try {
          const f = t.deformOutputs.val.deformations, M = t.analyzeOutputs.val ?? {}, i = M.pressure instanceof Map ? M.pressure : /* @__PURE__ */ new Map();
          let p = 0, u = 0;
          for (const w of c.areaSprings) {
            const m = B.get(w.id);
            if (m === void 0) continue;
            const O = k[m].map((g) => {
              var _a2;
              const x = ((_a2 = f.get(g)) == null ? void 0 : _a2[2]) ?? 0, E = w.ks * x;
              return E < p && (p = E), E > u && (u = E), E;
            });
            i.set(m, O);
          }
          i.size > 0 && (M.pressure = i, M.colorMapRanges = {
            ...M.colorMapRanges ?? {},
            pressure: [
              u,
              p
            ]
          }, t.analyzeOutputs.val = M, console.log(`[CLI Modeler] presi\xF3n Winkler: ${i.size} shells, \u03C3 ${p.toFixed(0)}..${u.toFixed(0)} kN/m\xB2`));
        } catch (f) {
          console.warn("[CLI Modeler] presi\xF3n:", (f == null ? void 0 : f.message) ?? f);
        }
        if (ee.length > 0) try {
          const f = t.deformOutputs.val.deformations, M = /* @__PURE__ */ new Map(), i = /* @__PURE__ */ new Map();
          for (const p of ee) {
            const u = k[p], w = u.map((O) => D[O]), m = u.flatMap((O) => {
              const g = f.get(O) ?? [
                0,
                0,
                0
              ];
              return [
                g[0],
                g[1],
                g[2]
              ];
            }), A = Ze(w, o.get(p) ?? 25e6, Y.get(p) ?? 0.2, m, c.solidIncompatible);
            M.set(p, A.stress), i.set(p, A.vonMises);
          }
          t.analyzeOutputs.val = {
            ...t.analyzeOutputs.val ?? {},
            solidStress: M,
            solidVonMises: i
          };
        } catch (f) {
          console.warn("[CLI Modeler] tensiones de solidos:", (f == null ? void 0 : f.message) ?? f);
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
      const G = t.deformOutputs.val;
      if ((_a = G == null ? void 0 : G.deformations) == null ? void 0 : _a.size) for (const [, s] of G.deformations) Math.abs(s[2]) > Math.abs(de) && (de = s[2]);
      if ((_b = G == null ? void 0 : G.reactions) == null ? void 0 : _b.size) for (const [, s] of G.reactions) we += s[2] || 0;
      window.__hekatanCliVista = c.vista ?? null, window.__hekatanCliStats = {
        nodes: D.length,
        frames: c.frames.length,
        shells: c.shells.length,
        supports: oe.size,
        loads: _.size,
        springs: ne.length,
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
