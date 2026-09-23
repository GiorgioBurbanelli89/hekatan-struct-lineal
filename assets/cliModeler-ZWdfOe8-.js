import { i as Ne, t as qe, c as _e, d as Be, a as Ye, b as Ue } from "./cadSections-BcRFaG1j.js";
import { c as Je } from "./cargasPorCaso-B_GZ_-rO.js";
import { h as Ge, a as Ze, __tla as __tla_0 } from "./h8-BasB3Yl9.js";
import { a as Ve } from "./analyze-C-HJ03ae.js";
import { m as He, d as Ke, __tla as __tla_1 } from "./didacticCpp-iMwzdM-v.js";
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
  function je(f) {
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
    if (c.length > 1 && c.length <= 6 && c.every((A) => A === "0" || A === "1")) return c.forEach((A, B) => {
      X[B] = A === "1";
    }), X;
    for (const A of c) Oe[A] !== void 0 && (X[Oe[A]] = true);
    if (/^[01]+$/.test(o) && o.length <= 6) for (let A = 0; A < o.length; A++) X[A] = o[A] === "1";
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
    let X = null, c = 0, A = 0, B = 0;
    const O = f.split(/\r?\n/);
    for (let Y = 0; Y < O.length; Y++) {
      let k = O[Y].trim();
      if (!k || k.startsWith("#") || k.startsWith("//")) continue;
      k = k.replace(/[;]+$/, "");
      const s = k.split(/\s+/), z = s[0].toLowerCase();
      if (z === "nodes" && s.length === 1) {
        X = "nodes";
        continue;
      }
      if ((z === "elements" || z === "frames") && s.length === 1) {
        X = "elements";
        continue;
      }
      if (z === "areas" && s.length === 1) {
        X = "areas";
        continue;
      }
      if (z === "supports" && s.length === 1) {
        X = "supports";
        continue;
      }
      if (z === "loads" && s.length === 1) {
        X = "loads";
        continue;
      }
      if (z === "springs" && s.length === 1) {
        X = "springs";
        continue;
      }
      if (X && /^[\-\d]/.test(s[0])) {
        const e = s.map(parseFloat);
        if (X === "nodes" && e.length >= 3) {
          c++, o.nodes.set(c, [
            e[0],
            e[1],
            e[2]
          ]);
          continue;
        }
        if (X === "elements" && e.length >= 2) {
          A++, o.frames.push({
            id: A,
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
      if (X === "supports" && /^\d/.test(s[0])) {
        const e = parseInt(s[0], 10), n = s.slice(1).join(" ");
        o.supports.set(e, je(n));
        continue;
      }
      X && !/^[\-\d]/.test(s[0]) && (X = null);
      try {
        switch (z) {
          case "node":
          case "n": {
            const e = parseInt(s[1], 10), n = parseFloat(s[2]), a = parseFloat(s[3]), r = parseFloat(s[4]);
            !isFinite(e) || !isFinite(n) || !isFinite(a) || !isFinite(r) ? o.errors.push(`L${Y + 1}: node mal formado: ${k}`) : o.nodes.set(e, [
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
            const e = parseInt(s[1], 10), n = parseInt(s[2], 10), a = parseInt(s[3], 10), r = parseFloat(s[4] ?? "25e6"), l = parseFloat(s[5] ?? "0.16"), F = parseFloat(s[6] ?? "0.001"), I = s[7] !== void 0 ? parseFloat(s[7]) : void 0, m = s[8] !== void 0 ? parseFloat(s[8]) : void 0, L = s[9] !== void 0 ? parseFloat(s[9]) : void 0, v = s[10] !== void 0 ? parseFloat(s[10]) : void 0, j = s[11] !== void 0 ? parseFloat(s[11]) : void 0, R = s[12] !== void 0 ? parseFloat(s[12]) : void 0, V = s.indexOf("#"), J = V >= 0 && s[V + 1] ? s[V + 1] : void 0;
            o.frames.push({
              id: e,
              nI: n,
              nJ: a,
              E: r,
              A: l,
              I: F,
              Iy: I,
              J: m,
              nu: L,
              rho: v,
              D: j,
              B: R,
              sec: J
            });
            break;
          }
          case "cftc": {
            const e = parseInt(s[1], 10), n = parseFloat(s[2] ?? ""), a = parseFloat(s[3] ?? ""), r = parseFloat(s[4] ?? "25e6"), l = parseFloat(s[5] ?? "0.2"), F = parseFloat(s[6] ?? "2.4");
            isFinite(e) && n > 0 && a > 0 && a < n / 2 && r > 0 ? o.frameCftc.set(e, {
              D: n,
              t: a,
              Ec: r,
              nuC: isFinite(l) ? l : 0.2,
              rhoC: isFinite(F) && F >= 0 ? F : 2.4
            }) : o.errors.push(`cftc ${s[1]}: hace falta D t (m) y Ec (kN/m2), con t < D/2`);
            break;
          }
          case "isec":
          case "perfili": {
            const e = parseInt(s[1], 10), n = s.slice(2, 8).map((L) => parseFloat(L)), [a, r, l, F] = n, I = isFinite(n[4]) ? n[4] : r, m = isFinite(n[5]) ? n[5] : l;
            isFinite(e) && a > 0 && r > 0 && l > 0 && F > 0 && I > 0 && m > 0 && l + m < a && F < Math.min(r, I) ? o.frameISec.set(e, {
              d: a,
              bf: r,
              tf: l,
              tw: F,
              t2b: I,
              tfb: m
            }) : o.errors.push(`isec ${s[1]}: hace falta d bf tf tw [t2b tfb] (m), con tf+tfb < d y tw < bf`);
            break;
          }
          case "tubo":
          case "tube": {
            const e = parseInt(s[1], 10), [n, a, r, l] = s.slice(2, 6).map((F) => parseFloat(F));
            isFinite(e) && n > 0 && a > 0 && r > 0 && l > 0 && l < n / 2 && r < a / 2 ? o.frameTube.set(e, {
              b: n,
              h: a,
              tf: r,
              tw: l
            }) : o.errors.push(`tubo ${s[1]}: hace falta b h tf tw (m), con tw < b/2 y tf < h/2`);
            break;
          }
          case "canal":
          case "channel": {
            const e = parseInt(s[1], 10), [n, a, r, l] = s.slice(2, 6).map((F) => parseFloat(F));
            isFinite(e) && n > 0 && a > 0 && r > 0 && l > 0 && 2 * r < n && l < a ? o.frameCanal.set(e, {
              d: n,
              bf: a,
              tf: r,
              tw: l
            }) : o.errors.push(`canal ${s[1]}: hace falta d bf tf tw (m), con 2\xB7tf < d y tw < bf`);
            break;
          }
          case "dosl":
          case "2l": {
            const e = parseInt(s[1], 10), [n, a, r, l, F] = s.slice(2, 7).map((m) => parseFloat(m)), I = (a - (F || 0)) / 2;
            isFinite(e) && n > 0 && a > 0 && r > 0 && l > 0 && F >= 0 && I > l && r < n ? o.frameDosL.set(e, {
              d: n,
              t2: a,
              tf: r,
              tw: l,
              dis: F
            }) : o.errors.push(`dosl ${s[1]}: hace falta d t2 tf tw dis (m), con (t2 \u2212 dis)/2 > tw`);
            break;
          }
          case "cft": {
            const e = parseInt(s[1], 10), n = s.slice(2).map((R) => parseFloat(R)), a = n.length >= 5 && n[3] < 1 && n[4] >= 1, r = n[0], l = n[1], F = n[2], I = a ? n[3] : n[2], m = a ? 4 : 3, L = isFinite(n[m]) ? n[m] : 25e6, v = isFinite(n[m + 1]) ? n[m + 1] : 0.2, j = isFinite(n[m + 2]) ? n[m + 2] : 2.4;
            isFinite(e) && r > 0 && l > 0 && F > 0 && I > 0 && I < r / 2 && F < l / 2 && L > 0 ? o.frameCft.set(e, {
              b: r,
              h: l,
              t: F,
              tw: I,
              Ec: L,
              nuC: v,
              rhoC: j >= 0 ? j : 2.4
            }) : o.errors.push(`cft ${s[1]}: hace falta b h t [tw] (m) y Ec (kN/m2), con tw < b/2 y t < h/2`);
            break;
          }
          case "as":
          case "shearareas": {
            const e = parseInt(s[1], 10), n = parseFloat(s[2] ?? "0"), a = parseFloat(s[3] ?? "0");
            isFinite(e) && isFinite(n) && isFinite(a) && o.frameShearAreas.set(e, [
              n,
              a
            ]);
            break;
          }
          case "release":
          case "rel": {
            const e = parseInt(s[1], 10), n = s.slice(2).map((r) => r.toLowerCase());
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
            const e = parseInt(s[1], 10), n = s.slice(2, 10).map((a) => parseInt(a, 10));
            if (!isFinite(e) || n.length !== 8 || n.some((a) => !isFinite(a))) {
              o.errors.push(`hex ${s[1]}: hacen falta 8 nudos`);
              break;
            }
            o.solids.push({
              id: e,
              pts: n,
              E: parseFloat(s[10] ?? "25e6"),
              nu: parseFloat(s[11] ?? "0.2"),
              rho: parseFloat(s[12] ?? "2.45")
            });
            break;
          }
          case "incompatible": {
            const e = (s[1] ?? "1").toLowerCase();
            o.solidIncompatible = !(e === "0" || e === "no" || e === "off" || e === "false");
            break;
          }
          case "torsion":
          case "jmod": {
            const e = (s[1] ?? "safe").toLowerCase(), n = e === "safe" ? 0.1 : parseFloat(e);
            o.torsionFactor = isFinite(n) && n > 0 ? n : 1;
            break;
          }
          case "decksec": {
            const e = parseInt(s[1], 10), n = s.slice(2).map(parseFloat);
            if (!isFinite(e) || n.length < 5 || n.slice(0, 5).some((a) => !isFinite(a) || a < 0) || !(n[0] > 0)) {
              o.errors.push(`decksec ${s[1]}: se esperaba ID tc hr wrt wrb sr [w]`);
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
            const e = (s[1] ?? "etabs").toLowerCase();
            o.deckEtabs = e === "etabs" || e === "1" || e === "on" || e === "si", o.deckOneWay = s.slice(2).some((n) => /^(oneway|1way|unidireccional)$/i.test(n));
            break;
          }
          case "areaspring":
          case "winkler":
          case "springarea":
          case "winklerarea": {
            const e = parseInt(s[1], 10), n = parseFloat(s[2] ?? "0"), a = s.slice(3).some((l) => /^(nodal|lumped|sap|etabs)$/i.test(l)), r = s.slice(3).some((l) => /^(compresion|compression|compressiononly|solocompresion)$/i.test(l));
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
            const e = (s[1] ?? "etabs").toLowerCase();
            o.edgeEtabs = e === "etabs" || e === "1" || e === "on" || e === "si" || e === "hermite", o.edgeLineal = e === "lineal" || e === "linear" || e === "safe" || e === "sap" || e === "linea", o.edgeLineal && (o.edgeEtabs = true);
            break;
          }
          case "automesh":
          case "automallado": {
            const e = (s[1] ?? "1.25").toLowerCase();
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
            const e = (s[1] ?? "1").toLowerCase();
            o.meshCross = !(e === "0" || e === "no" || e === "off" || e === "false");
            break;
          }
          case "etabsjoint":
          case "etabswalljoint": {
            const e = (s[1] ?? "1").toLowerCase();
            o.etabsWallJoint = !(e === "0" || e === "no" || e === "off" || e === "false");
            break;
          }
          case "selfweight":
          case "peso":
          case "sw": {
            const e = parseFloat(s[1] ?? "1");
            o.selfWeight = isFinite(e) ? e : 1;
            break;
          }
          case "endoffset":
          case "offset":
          case "lengthoff": {
            const e = parseInt(s[1], 10), n = parseFloat(s[2] ?? "0"), a = parseFloat(s[3] ?? "0"), r = parseFloat(s[4] ?? "0");
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
            const e = parseInt(s[1], 10), n = parseFloat(s[2] ?? "0");
            isFinite(e) && isFinite(n) && o.frameAngles.set(e, n);
            break;
          }
          case "shell":
          case "plate":
          case "s": {
            const e = parseInt(s[1], 10), n = [
              parseInt(s[2], 10),
              parseInt(s[3], 10),
              parseInt(s[4], 10),
              parseInt(s[5], 10)
            ], a = parseFloat(s[6] ?? "0.20"), r = parseFloat(s[7] ?? "25e6"), l = s[9] !== void 0 ? parseFloat(s[9]) : void 0, F = l !== void 0 && isFinite(l) ? l : void 0;
            if (o.shells.push({
              id: e,
              pts: n,
              t: a,
              E: r,
              rho: F
            }), s[8] !== void 0) {
              const I = parseFloat(s[8]);
              isFinite(I) && I !== 0 && o.shellLoads.set(e, I);
            }
            break;
          }
          case "tri": {
            const e = parseInt(s[1], 10), n = [
              parseInt(s[2], 10),
              parseInt(s[3], 10),
              parseInt(s[4], 10)
            ], a = parseFloat(s[5] ?? "0.20"), r = parseFloat(s[6] ?? "25e6"), l = s[8] !== void 0 ? parseFloat(s[8]) : void 0, F = l !== void 0 && isFinite(l) ? l : void 0;
            if (o.shells.push({
              id: e,
              pts: n,
              t: a,
              E: r,
              rho: F
            }), s[7] !== void 0) {
              const I = parseFloat(s[7]);
              isFinite(I) && I !== 0 && o.shellLoads.set(e, I);
            }
            break;
          }
          case "shelltype":
          case "plateform": {
            const e = parseInt(s[1], 10), n = (s[2] ?? "").toLowerCase();
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
            const e = parseInt(s[1], 10);
            if (!isFinite(e)) break;
            const n = s.slice(2).map(parseFloat);
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
            const e = s.slice(1).map((v) => parseInt(v, 10));
            if (e.length < 7 || e.some((v) => !isFinite(v))) {
              o.errors.push('areaobj: se esperaba "areaobj ID n1 n2 n3 n4 desdeShell hastaShell"');
              break;
            }
            const [n, a, r, l, F, I, m] = e, L = [];
            for (let v = I; v <= m; v++) L.push(v);
            o.areaObjs.push({
              id: n,
              pts: [
                a,
                r,
                l,
                F
              ],
              cells: L
            });
            break;
          }
          case "shellang": {
            const e = parseInt(s[1], 10), n = parseFloat(s[2]);
            if (!isFinite(e) || !isFinite(n)) {
              o.errors.push('shellang: se esperaba "shellang shellID grados"');
              break;
            }
            o.shellAngles.set(e, n);
            break;
          }
          case "areaload":
          case "qarea": {
            const e = parseInt(s[1], 10), n = parseFloat(s[2]);
            if (!isFinite(e) || !isFinite(n)) {
              o.errors.push('areaload: se esperaba "areaload shellID q"');
              break;
            }
            o.shellLoads.set(e, n);
            break;
          }
          case "support":
          case "fix": {
            const e = parseInt(s[1], 10), n = s.findIndex((r, l) => l >= 2 && r.startsWith("#")), a = s.slice(2, n < 0 ? void 0 : n).join(" ");
            o.supports.set(e, je(a));
            break;
          }
          case "load":
          case "l": {
            const e = parseInt(s[1], 10), n = parseFloat(s[2] ?? "0"), a = parseFloat(s[3] ?? "0"), r = parseFloat(s[4] ?? "0"), l = parseFloat(s[5] ?? "0"), F = parseFloat(s[6] ?? "0"), I = parseFloat(s[7] ?? "0"), m = s[8] && isNaN(parseFloat(s[8])) ? s[8] : "Dead";
            /^dead$/i.test(m) ? o.loads.set(e, [
              n,
              a,
              r,
              l,
              F,
              I
            ]) : (o.loadsPat.has(m) || o.loadsPat.set(m, /* @__PURE__ */ new Map()), o.loadsPat.get(m).set(e, [
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
            const e = parseInt(s[1], 10), n = parseFloat(s[2] ?? "0"), a = parseFloat(s[3] ?? "0"), r = parseFloat(s[4] ?? "0"), l = s[5] && isNaN(parseFloat(s[5])) ? s[5] : "Dead", F = /^dead$/i.test(l) ? o.frameLoads : o.frameLoadsPat.get(l) ?? (o.frameLoadsPat.set(l, /* @__PURE__ */ new Map()), o.frameLoadsPat.get(l)), I = F.get(e) ?? [
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
            const e = parseInt(s[1], 10), n = (s[2] ?? "uz").toLowerCase(), a = Oe[n] ?? 2, r = parseFloat(s[3] ?? "1000");
            o.springs.push({
              node: e,
              dof: a,
              k: r
            });
            break;
          }
          case "diaph":
          case "diaphragm": {
            const e = parseInt(s[1], 10), n = parseInt(s[2] ?? "1", 10);
            isFinite(e) && isFinite(n) && n > 0 && o.diaphragms.set(e, n);
            break;
          }
          case "mass": {
            const e = parseInt(s[1], 10), n = parseFloat(s[2] ?? "0");
            Number.isFinite(e) && Number.isFinite(n) ? o.masses.set(e, (o.masses.get(e) ?? 0) + n) : o.errors.push(`L${Y + 1}: mass necesita <nudo> <toneladas>`);
            break;
          }
          case "vista": {
            const e = s.slice(1).filter((n) => !/^resultados?$/i.test(n));
            e[0] && (o.vista = {
              campo: e[0],
              caso: e[1]
            });
            break;
          }
          case "fc": {
            const e = parseFloat(s[1]);
            isFinite(e) && e > 0 ? o.fc = e : o.errors.push("fc: uso fc <kN/m2>");
            break;
          }
          case "combo":
          case "combinacion": {
            const e = s[1], n = [];
            for (let a = 2; a + 1 < s.length; a += 2) {
              const r = parseFloat(s[a + 1]);
              isFinite(r) && n.push([
                s[a],
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
            o.errors.push(`L${Y + 1}: comando desconocido "${z}"`);
        }
      } catch (e) {
        o.errors.push(`L${Y + 1}: error "${k}" \u2014 ${e.message}`);
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
`, Z = (f, o) => [
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
  function Pe(f, o) {
    const X = f.shellModsDir.get(o);
    return !!X && Math.abs(X[3]) < 1e-12 && Math.abs(X[4]) < 1e-12 && Math.abs(X[5]) < 1e-12;
  }
  function ss(f, o = 200, X) {
    const c = [
      0,
      1,
      2
    ].map((m) => (f[0][m] + f[1][m] + f[2][m] + f[3][m]) / 4);
    let A = Z(f[1], f[0]), B = Fe(A, Z(f[3], f[0]));
    B = re(B, 1 / K(B)), A = re(A, 1 / K(A));
    const O = Fe(B, A), Y = f.map((m) => [
      fe(Z(m, c), A),
      fe(Z(m, c), O)
    ]);
    let k = [
      0,
      1,
      2,
      3
    ];
    if (X) {
      const m = [
        0,
        1,
        2,
        3
      ].map((L) => {
        const v = Z(f[(L + 1) % 4], f[L]);
        return Math.abs(fe(v, X)) / K(v);
      });
      k = [
        0,
        1,
        2,
        3
      ].sort((L, v) => m[L] - m[v]).slice(0, 2);
    }
    const s = Y.map((m) => m[0]), z = Y.map((m) => m[1]), e = Math.min(...s), n = Math.max(...s), a = Math.min(...z), r = Math.max(...z), l = [
      0,
      1,
      2,
      3
    ].map(() => ({
      pts: [],
      dA: 0
    }));
    let F = 0;
    for (let m = 0; m < o; m++) for (let L = 0; L < o; L++) {
      const v = e + (n - e) * (m + 0.5) / o, j = a + (r - a) * (L + 0.5) / o;
      let R = 0, V = 0;
      for (let _ = 0; _ < 4; _++) {
        const U = Y[_], se = Y[(_ + 1) % 4];
        (se[0] - U[0]) * (j - U[1]) - (se[1] - U[1]) * (v - U[0]) >= 0 ? R++ : V++;
      }
      if (R !== 4 && V !== 4) continue;
      let J = k[0], P = 1 / 0;
      for (const _ of k) {
        const U = Y[_], se = Y[(_ + 1) % 4], oe = se[0] - U[0], W = se[1] - U[1], pe = oe * oe + W * W, le = Math.max(0, Math.min(1, ((v - U[0]) * oe + (j - U[1]) * W) / pe)), te = Math.hypot(v - (U[0] + le * oe), j - (U[1] + le * W));
        te < P && (P = te, J = _);
      }
      l[J].pts.push([
        c[0] + v * A[0] + j * O[0],
        c[1] + v * A[1] + j * O[1],
        c[2] + v * A[2] + j * O[2]
      ]), F++;
    }
    const I = 0.5 * K(Fe(Z(f[2], f[0]), Z(f[3], f[1])));
    for (const m of l) m.dA = F ? I / F : 0;
    return l;
  }
  function ts(f, o) {
    if (!(o > 0)) return;
    const X = 1e-6, c = (z) => f.nodes.get(z);
    let A = Math.max(0, ...f.nodes.keys()) + 1, B = f.shells.reduce((z, e) => Math.max(z, e.id), 0) + 1;
    const O = (z) => {
      for (const [n, a] of f.nodes) if (K(Z(a, z)) < X) return n;
      const e = A++;
      return f.nodes.set(e, [
        z[0],
        z[1],
        z[2]
      ]), e;
    }, Y = (z, e) => {
      const n = f.shellModsDir.get(z);
      n && f.shellModsDir.set(e, [
        ...n
      ]);
      const a = f.shellMods.get(z);
      a && f.shellMods.set(e, [
        ...a
      ]);
      const r = f.shellLoads.get(z);
      r !== void 0 && f.shellLoads.set(e, r);
      const l = f.shellTypes.get(z);
      l !== void 0 && f.shellTypes.set(e, l);
      const F = f.shellAngles.get(z);
      F !== void 0 && f.shellAngles.set(e, F);
    }, k = [];
    let s = 0;
    for (const z of f.shells) {
      if (z.pts.length !== 4) {
        k.push(z);
        continue;
      }
      const e = z.pts.map(c);
      if (e.some((m) => !m)) {
        k.push(z);
        continue;
      }
      const n = (K(Z(e[1], e[0])) + K(Z(e[2], e[3]))) / 2, a = (K(Z(e[3], e[0])) + K(Z(e[2], e[1]))) / 2, r = Math.max(1, Math.ceil(n / o - 1e-9)), l = Math.max(1, Math.ceil(a / o - 1e-9));
      if (r === 1 && l === 1) {
        k.push(z);
        continue;
      }
      const F = (m, L) => [
        0,
        1,
        2
      ].map((v) => e[0][v] * (1 - m) * (1 - L) + e[1][v] * m * (1 - L) + e[2][v] * m * L + e[3][v] * (1 - m) * L), I = [];
      for (let m = 0; m <= r; m++) {
        const L = [];
        for (let v = 0; v <= l; v++) L.push(O(F(m / r, v / l)));
        I.push(L);
      }
      for (let m = 0; m < r; m++) for (let L = 0; L < l; L++) {
        const v = m === 0 && L === 0 ? z.id : B++;
        k.push({
          ...z,
          id: v,
          pts: [
            I[m][L],
            I[m + 1][L],
            I[m + 1][L + 1],
            I[m][L + 1]
          ]
        }), v !== z.id && Y(z.id, v);
      }
      s++;
    }
    s && (f.shells = k, console.log(`[CLI Modeler] automesh ${o} m: ${s} pano(s) partido(s) -> ${f.shells.length} cascaras, ${f.nodes.size} nudos`));
  }
  function os(f) {
    const X = (a) => f.nodes.get(a), c = [
      ...f.nodes.keys()
    ], A = (a, r, l) => {
      const F = Z(r, a), I = K(F), m = re(F, 1 / I), L = [];
      for (const v of c) {
        if (l.includes(v)) continue;
        const j = Z(X(v), a), R = fe(j, m);
        R > 1e-6 && R < I - 1e-6 && K(Z(j, re(m, R))) < 1e-4 && L.push(R / I);
      }
      return L.sort((v, j) => v - j);
    }, B = (a, r) => {
      const l = [];
      for (const F of a) r.some((I) => Math.abs(F - I) < 1e-5) && !l.some((I) => Math.abs(F - I) < 1e-5) && l.push(F);
      return l;
    }, O = (a) => {
      for (const r of c) if (K(Z(X(r), a)) < 1e-4) return r;
    };
    let Y = f.shells.reduce((a, r) => Math.max(a, r.id), 0) + 1;
    const k = [], s = (a, r) => {
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
      const m = f.shellTypes.get(a);
      m !== void 0 && f.shellTypes.set(r, m);
      const L = f.shellAngles.get(a);
      L !== void 0 && f.shellAngles.set(r, L);
    };
    for (const a of f.shells) {
      if (!Pe(f, a.id) || a.pts.length !== 4 || a.pts.some((J) => !f.nodes.has(J))) {
        k.push(a);
        continue;
      }
      const r = a.pts.map(X), l = A(r[0], r[1], a.pts), F = A(r[2], r[3], a.pts).map((J) => 1 - J), I = A(r[1], r[2], a.pts), m = A(r[3], r[0], a.pts).map((J) => 1 - J);
      let L = [
        0,
        ...B(l, F),
        1
      ], v = [
        0,
        ...B(I, m),
        1
      ];
      if (L.length === 2 && v.length === 2) {
        k.push(a);
        continue;
      }
      const j = (J, P) => [
        0,
        1,
        2
      ].map((_) => (1 - J) * (1 - P) * r[0][_] + J * (1 - P) * r[1][_] + J * P * r[2][_] + (1 - J) * P * r[3][_]);
      let R = v.map((J) => L.map((P) => O(j(P, J))));
      if (R.some((J) => J.some((P) => P === void 0)) && (L.length >= v.length ? v = [
        0,
        1
      ] : L = [
        0,
        1
      ], R = v.map((J) => L.map((P) => O(j(P, J)))), R.some((J) => J.some((P) => P === void 0)))) {
        k.push(a);
        continue;
      }
      let V = true;
      for (let J = 0; J < v.length - 1; J++) for (let P = 0; P < L.length - 1; P++) {
        const _ = [
          R[J][P],
          R[J][P + 1],
          R[J + 1][P + 1],
          R[J + 1][P]
        ], U = V ? a.id : Y++;
        V || s(a.id, U), V = false, k.push({
          id: U,
          pts: _,
          t: a.t,
          E: a.E,
          rho: a.rho
        });
      }
    }
    f.shells = k;
    const z = 9.80665, e = (a, r) => {
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
      const l = Z(r, a), F = K(l), I = re(l, 1 / F);
      return f.frames.filter((m) => [
        m.nI,
        m.nJ
      ].every((L) => {
        const v = f.nodes.get(L);
        if (!v) return false;
        const j = Z(v, a), R = fe(j, I);
        return R > -1e-4 && R < F + 1e-4 && K(Z(j, re(I, R))) < 1e-4;
      }));
    };
    for (const a of f.shells) {
      if (!Pe(f, a.id) || a.pts.length !== 4) continue;
      const r = f.selfWeight ? (a.rho ?? 2.45) * a.t * z * f.selfWeight : 0, l = f.shellLoads.get(a.id) ?? 0, F = -r + l;
      if (Math.abs(F) < 1e-15) continue;
      const I = a.pts.map(X);
      let m;
      if (f.deckOneWay) {
        const v = Z(I[1], I[0]);
        let j = Fe(v, Z(I[3], I[0]));
        j = re(j, 1 / K(j));
        const R = re(v, 1 / K(v)), V = Fe(j, R), J = (f.shellAngles.get(a.id) ?? 0) * Math.PI / 180;
        m = [
          0,
          1,
          2
        ].map((P) => Math.cos(J) * R[P] + Math.sin(J) * V[P]);
      }
      const L = ss(I, 200, m);
      for (let v = 0; v < 4; v++) {
        const { pts: j, dA: R } = L[v];
        if (!j.length) continue;
        const V = I[v], J = I[(v + 1) % 4], P = n(V, J);
        if (!P.length) {
          const W = F * R * j.length;
          e(a.pts[v], [
            0,
            0,
            W / 2,
            0,
            0,
            0
          ]), e(a.pts[(v + 1) % 4], [
            0,
            0,
            W / 2,
            0,
            0,
            0
          ]);
          continue;
        }
        const _ = Z(J, V), U = K(_), se = re(_, 1 / U), oe = j.map((W) => fe(Z(W, V), se));
        for (const W of P) {
          const pe = X(W.nI), le = X(W.nJ), te = fe(Z(pe, V), se), be = fe(Z(le, V), se), Me = Math.min(te, be), ie = Math.max(te, be), Q = ie - Me;
          if (Q < 1e-9) continue;
          const Ce = ie >= U - 1e-6, ne = re(Z(le, pe), 1 / Q), ee = Fe(ne, [
            0,
            0,
            1
          ]);
          let he = 0, ce = 0, Ie = 0, me = 0;
          for (const de of oe) {
            if (de < Me - 1e-9 || (Ce ? de > ie + 1e-9 : de >= ie - 1e-9)) continue;
            let we = de - Me;
            te > be && (we = Q - we);
            const G = we / Q;
            he += 1 - 3 * G * G + 2 * G * G * G, ce += Q * (G - 2 * G * G + G * G * G), Ie += 3 * G * G - 2 * G * G * G, me += Q * (-G * G + G * G * G);
          }
          const ae = F * R;
          e(W.nI, [
            0,
            0,
            ae * he,
            ee[0] * ae * ce,
            ee[1] * ae * ce,
            ee[2] * ae * ce
          ]), e(W.nJ, [
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
      const c = o.nodes.val, A = o.elements.val;
      if (!(!c.length || !A.length)) try {
        const B = Math.max(1, parseInt(window.__hekatanCliModalModes ?? "12", 10) || 12), O = o.nodeInputs.val, Y = window.__hekatanCliSprings, k = He(c, A, O, o.elementInputs.val, B, 0, 0, 1, (O == null ? void 0 : O.diaphragms) instanceof Map && O.diaphragms.size ? O.diaphragms : void 0, Y && Y.length ? Y : void 0);
        console.log(`[CLI Modeler] Modal OK \u2014 ${k.frequencies.length} modos, T1 = ${k.frequencies[0] ? (1 / k.frequencies[0]).toFixed(5) : "\u2014"} s`), (_a = X == null ? void 0 : X.render) == null ? void 0 : _a.call(X, k, {
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
      const A = /* @__PURE__ */ new Map(), B = /* @__PURE__ */ new Map(), O = [], Y = Array.from(c.nodes.keys()).sort((t, d) => t - d);
      for (const t of Y) A.set(t, O.length), O.push(c.nodes.get(t));
      const k = [], s = /* @__PURE__ */ new Map(), z = /* @__PURE__ */ new Map(), e = /* @__PURE__ */ new Map(), n = /* @__PURE__ */ new Map(), a = /* @__PURE__ */ new Map(), r = /* @__PURE__ */ new Map(), l = /* @__PURE__ */ new Map(), F = /* @__PURE__ */ new Map(), I = /* @__PURE__ */ new Map(), m = /* @__PURE__ */ new Map(), L = /* @__PURE__ */ new Map(), v = /* @__PURE__ */ new Map(), j = /* @__PURE__ */ new Map(), R = /* @__PURE__ */ new Map(), V = /* @__PURE__ */ new Map(), J = /* @__PURE__ */ new Map(), P = /* @__PURE__ */ new Map(), _ = /* @__PURE__ */ new Map(), U = /* @__PURE__ */ new Map(), se = /* @__PURE__ */ new Map();
      for (const t of c.frames) {
        const d = A.get(t.nI), M = A.get(t.nJ);
        if (d === void 0 || M === void 0) {
          const w = Y.length ? `IDs disponibles: ${Y.join(", ")}` : "ning\xFAn nodo definido", $ = [];
          d === void 0 && $.push(t.nI), M === void 0 && $.push(t.nJ), c.errors.push(`frame ${t.id}: nodo(s) inexistente(s) [${$.join(", ")}] \u2014 ${w}`);
          continue;
        }
        const i = k.length;
        k.push([
          d,
          M
        ]);
        const h = t.nu ?? 0.2;
        s.set(i, t.E), z.set(i, t.E / (2 * (1 + h))), e.set(i, t.A), n.set(i, t.I), a.set(i, t.Iy ?? t.I), r.set(i, t.J ?? 0.14 * Math.pow(Math.sqrt(t.A), 4)), l.set(i, t.rho ?? 2.45), U.set(i, h), t.D !== void 0 && isFinite(t.D) && F.set(i, t.D), t.B !== void 0 && isFinite(t.B) && I.set(i, t.B);
        const p = c.frameAngles.get(t.id);
        p !== void 0 && isFinite(p) && L.set(i, p);
        const g = c.frameReleases.get(t.id);
        g && v.set(i, g);
        const u = c.frameEndOffsets.get(t.id);
        u && j.set(i, u);
        const x = c.frameLoads.get(t.id);
        x && J.set(i, x);
        const E = c.frameShearAreas.get(t.id);
        if (E && (_.set(i, E[0]), P.set(i, E[1])), t.sec || t.D !== void 0 && t.B !== void 0) {
          const w = {
            type: "general"
          };
          t.sec && (w.name = t.sec), t.D !== void 0 && isFinite(t.D) && (w.h = t.D), t.B !== void 0 && isFinite(t.B) && (w.b = t.B), m.set(i, w);
        }
        const b = c.frameISec.get(t.id);
        if (b) {
          const w = Ne(b.d, b.bf, b.tf, b.tw, b.t2b, b.tfb);
          e.set(i, w.A), a.set(i, w.Iz), n.set(i, w.Iy), r.set(i, w.J), _.set(i, w.As2), P.set(i, w.As3), F.set(i, b.d), I.set(i, Math.max(b.bf, b.t2b));
          const $ = (N) => Math.round(N * 1e4) / 10;
          m.set(i, {
            type: "I",
            h: b.d,
            b: b.bf,
            tf: b.tf,
            tw: b.tw,
            t2b: b.t2b,
            tfb: b.tfb,
            name: t.sec ?? `I${$(b.d)}X${$(b.bf)}X${$(b.tf)}X${$(b.tw)}`
          });
        }
        const y = c.frameTube.get(t.id);
        if (y) {
          const w = qe(y.b, y.h, y.tf, y.tw);
          e.set(i, w.A), a.set(i, w.Iz), n.set(i, w.Iy), r.set(i, w.J), _.set(i, w.As2), P.set(i, w.As3), F.set(i, y.h), I.set(i, y.b);
          const $ = (N) => Math.round(N * 1e4) / 10;
          m.set(i, {
            type: "HSS",
            h: y.h,
            b: y.b,
            tf: y.tf,
            tw: y.tw,
            name: t.sec ?? `TUBO${$(y.h)}X${$(y.b)}X${$(y.tf)}X${$(y.tw)}`
          });
        }
        const D = c.frameCanal.get(t.id);
        if (D) {
          const w = _e(D.d, D.bf, D.tf, D.tw);
          e.set(i, w.A), a.set(i, w.Iz), n.set(i, w.Iy), r.set(i, w.J), _.set(i, w.As2), P.set(i, w.As3), F.set(i, D.d), I.set(i, D.bf);
          const $ = (N) => Math.round(N * 1e4) / 10;
          m.set(i, {
            type: "C",
            h: D.d,
            b: D.bf,
            tf: D.tf,
            tw: D.tw,
            name: t.sec ?? `C${$(D.d)}X${$(D.bf)}X${$(D.tf)}X${$(D.tw)}`
          });
        }
        const T = c.frameDosL.get(t.id);
        if (T) {
          const w = Be(T.d, T.t2, T.tf, T.tw, T.dis);
          e.set(i, w.A), a.set(i, w.Iz), n.set(i, w.Iy), r.set(i, w.J), _.set(i, w.As2), P.set(i, w.As3), F.set(i, T.d), I.set(i, T.t2);
          const $ = (N) => Math.round(N * 1e4) / 10;
          m.set(i, {
            type: "2L",
            h: T.d,
            b: T.t2,
            tf: T.tf,
            tw: T.tw,
            dis: T.dis,
            name: t.sec ?? `2L${$(T.d)}X${$(T.t2)}X${$(T.tf)}X${$(T.tw)}S${$(T.dis)}`
          });
        }
        const C = c.frameCftc.get(t.id);
        if (C) {
          const w = Ye(C.D, C.t, t.E, h, C.Ec, C.nuC);
          e.set(i, w.A), a.set(i, w.Iz), n.set(i, w.Iy), r.set(i, w.J), _.set(i, w.As2), P.set(i, w.As3), F.set(i, C.D), I.set(i, C.D);
          const $ = C.D - 2 * C.t, N = Math.PI * $ * $ / 4, q = Math.PI * C.D * C.D / 4 - N;
          l.set(i, ((t.rho ?? 7.85) * q + C.rhoC * N) / w.A), m.set(i, {
            type: "CFT",
            d: C.D,
            tw: C.t,
            fillE: C.Ec,
            fillRho: C.rhoC,
            steelRho: t.rho ?? 7.85,
            name: t.sec ?? `CFTC ${Math.round(C.D * 1e3)}X${Math.round(C.t * 1e3)}`
          });
        }
        const S = c.frameCft.get(t.id);
        if (S) {
          const w = Ue(S.b, S.h, S.t, t.E, h, S.Ec, S.nuC, S.tw);
          e.set(i, w.A), a.set(i, w.Iz), n.set(i, w.Iy), r.set(i, w.J), _.set(i, w.As2), P.set(i, w.As3), F.set(i, S.h), I.set(i, S.b);
          const $ = (S.b - 2 * S.tw) * (S.h - 2 * S.t), N = S.b * S.h - $;
          l.set(i, ((t.rho ?? 7.85) * N + S.rhoC * $) / w.A);
          const q = (H) => Math.round(H * 1e3);
          m.set(i, {
            type: "CFT",
            b: S.b,
            h: S.h,
            tw: S.tw,
            tf: S.t,
            fillE: S.Ec,
            fillRho: S.rhoC,
            steelRho: t.rho ?? 7.85,
            name: t.sec ?? `CFT ${q(S.h)}X${q(S.b)}X${q(S.t)}${S.tw !== S.t ? `X${q(S.tw)}` : ""}`
          });
        }
      }
      if (c.meshCross) {
        const t = (g, u) => g[0] * u[0] + g[1] * u[1] + g[2] * u[2], d = [
          s,
          z,
          e,
          n,
          a,
          r,
          l,
          U,
          F,
          I,
          L,
          P,
          _,
          m,
          J
        ], M = (g, u) => {
          for (const x of d) x.has(g) && x.set(u, x.get(g));
        }, i = (g) => {
          for (let u = 0; u < O.length; u++) if (Math.hypot(O[u][0] - g[0], O[u][1] - g[1], O[u][2] - g[2]) < 1e-6) return u;
          return O.push([
            g[0],
            g[1],
            g[2]
          ]), O.length - 1;
        }, h = (g) => {
          const u = O[g[0]], x = O[g[1]];
          return [
            Math.min(u[0], x[0]),
            Math.min(u[1], x[1]),
            Math.min(u[2], x[2]),
            Math.max(u[0], x[0]),
            Math.max(u[1], x[1]),
            Math.max(u[2], x[2])
          ];
        };
        let p = 0;
        for (let g = 0; g < k.length; g++) {
          if (k[g].length !== 2) continue;
          const u = h(k[g]);
          for (let x = g + 1; x < k.length; x++) {
            if (k[x].length !== 2) continue;
            const [E, b] = k[g], [y, D] = k[x];
            if (E === y || E === D || b === y || b === D) continue;
            const T = h(k[x]);
            if (u[0] > T[3] + 1e-6 || T[0] > u[3] + 1e-6 || u[1] > T[4] + 1e-6 || T[1] > u[4] + 1e-6 || u[2] > T[5] + 1e-6 || T[2] > u[5] + 1e-6) continue;
            const C = O[E], S = O[b], w = O[y], $ = O[D], N = [
              S[0] - C[0],
              S[1] - C[1],
              S[2] - C[2]
            ], q = [
              $[0] - w[0],
              $[1] - w[1],
              $[2] - w[2]
            ], H = [
              C[0] - w[0],
              C[1] - w[1],
              C[2] - w[2]
            ], ue = t(N, N), ye = t(N, q), $e = t(q, q), ze = t(N, H), Te = t(q, H), Ae = ue * $e - ye * ye;
            if (Ae < 1e-10 * ue * $e) continue;
            const ve = (ye * Te - $e * ze) / Ae, ke = (ue * Te - ye * ze) / Ae;
            if (ve < 1e-6 || ve > 1 - 1e-6 || ke < 1e-6 || ke > 1 - 1e-6) continue;
            const Le = [
              C[0] + ve * N[0],
              C[1] + ve * N[1],
              C[2] + ve * N[2]
            ], Se = [
              w[0] + ke * q[0],
              w[1] + ke * q[1],
              w[2] + ke * q[2]
            ];
            if (Math.hypot(Le[0] - Se[0], Le[1] - Se[1], Le[2] - Se[2]) > 1e-6) continue;
            const Xe = i(Le);
            for (const ge of [
              g,
              x
            ]) {
              const [Re, We] = k[ge], Ee = k.length;
              k[ge] = [
                Re,
                Xe
              ], k.push([
                Xe,
                We
              ]), M(ge, Ee);
              const De = v.get(ge);
              De && (v.set(ge, [
                ...De.slice(0, 6),
                ...Array(6).fill(false)
              ]), v.set(Ee, [
                ...Array(6).fill(false),
                ...De.slice(6)
              ]));
              const xe = j.get(ge);
              xe && (j.set(ge, [
                xe[0],
                0,
                xe[2]
              ]), j.set(Ee, [
                0,
                xe[1],
                xe[2]
              ]));
            }
            p++;
          }
        }
        p > 0 && console.log(`[CLI Modeler] ${p} cruces de barras partidos con nudo (como ETABS; meshcross 0 lo apaga)`);
      }
      for (const t of c.shells) {
        const d = t.pts.map((p) => A.get(p));
        if (d.some((p) => p === void 0)) {
          c.errors.push(`shell ${t.id}: algun nodo inexistente`);
          continue;
        }
        const M = k.length;
        B.set(t.id, M), k.push(d), s.set(M, t.E), z.set(M, t.E / (2 * 1.2)), se.set(M, t.t), l.set(M, t.rho ?? 2.45), U.set(M, 0.2);
        const i = c.shellTypes.get(t.id);
        i !== void 0 && R.set(M, i);
        const h = c.deckSecs.get(t.id);
        if (h) {
          const p = h.tc + (h.sr > 0 ? h.hr * (h.wrt + h.wrb) / 2 / h.sr : 0);
          se.set(M, h.tc), l.set(M, ((t.rho ?? 2.45) * p + h.w / 9.80665) / h.tc), V.set(M, {
            ...h
          });
        }
      }
      const oe = /* @__PURE__ */ new Map();
      for (const [t, d] of c.supports.entries()) {
        const M = A.get(t);
        M !== void 0 && oe.set(M, d);
      }
      const W = /* @__PURE__ */ new Map();
      for (const [t, d] of c.loads.entries()) {
        const M = A.get(t);
        M !== void 0 && W.set(M, [
          ...d
        ]);
      }
      const pe = /* @__PURE__ */ new Map();
      for (const [t, d] of c.diaphragms.entries()) {
        const M = A.get(t);
        M !== void 0 && pe.set(M, d);
      }
      const le = /* @__PURE__ */ new Map();
      for (const [t, d] of c.masses.entries()) {
        const M = A.get(t);
        M !== void 0 && le.set(M, d);
      }
      const te = /* @__PURE__ */ new Map();
      for (const [t, d] of c.loadsPat) {
        const M = /* @__PURE__ */ new Map();
        for (const [i, h] of d) {
          const p = A.get(i);
          p !== void 0 && M.set(p, [
            ...h
          ]);
        }
        te.set(t, M);
      }
      const be = {
        Dead: new Map([
          ...W
        ].map(([t, d]) => [
          t,
          [
            ...d
          ]
        ]))
      };
      for (const [t, d] of te) be[t] = new Map([
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
          W
        ]
      ];
      for (const [t, d] of c.frameLoadsPat) te.has(t) || te.set(t, /* @__PURE__ */ new Map()), Me.push([
        d,
        te.get(t)
      ]);
      for (const [t, d] of Me) if (t.size) {
        const M = (i, h) => {
          const p = d.get(i) ?? [
            0,
            0,
            0,
            0,
            0,
            0
          ];
          d.set(i, [
            p[0] + h[0],
            p[1] + h[1],
            p[2] + h[2],
            p[3] + h[3],
            p[4] + h[4],
            p[5] + h[5]
          ]);
        };
        for (const [i, h] of t.entries()) {
          const p = c.frames.find((S) => S.id === i);
          if (!p) {
            c.errors.push(`frameload ${i}: no existe esa barra`);
            continue;
          }
          const g = A.get(p.nI), u = A.get(p.nJ);
          if (g === void 0 || u === void 0) continue;
          const x = O[g], E = O[u], b = [
            E[0] - x[0],
            E[1] - x[1],
            E[2] - x[2]
          ], y = Math.hypot(b[0], b[1], b[2]);
          if (y < 1e-9) continue;
          const D = [
            b[0] / y,
            b[1] / y,
            b[2] / y
          ], T = y * y / 12, C = [
            D[1] * h[2] - D[2] * h[1],
            D[2] * h[0] - D[0] * h[2],
            D[0] * h[1] - D[1] * h[0]
          ];
          M(g, [
            h[0] * y / 2,
            h[1] * y / 2,
            h[2] * y / 2,
            T * C[0],
            T * C[1],
            T * C[2]
          ]), M(u, [
            h[0] * y / 2,
            h[1] * y / 2,
            h[2] * y / 2,
            -T * C[0],
            -T * C[1],
            -T * C[2]
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
      for (const t of c.shells) {
        const d = c.shellLoads.get(t.id);
        if (!d || c.deckTributario.has(t.id)) continue;
        const M = t.pts.map((p) => A.get(p));
        if (M.some((p) => p === void 0)) {
          c.errors.push(`areaload ${t.id}: algun nodo inexistente`);
          continue;
        }
        const i = M.map((p) => O[p]);
        if (M.length === 3) {
          const p = [
            0,
            1,
            2
          ].map((x) => i[1][x] - i[0][x]), g = [
            0,
            1,
            2
          ].map((x) => i[2][x] - i[0][x]), u = Math.hypot(p[1] * g[2] - p[2] * g[1], p[2] * g[0] - p[0] * g[2], p[0] * g[1] - p[1] * g[0]) / 2;
          for (const x of M) {
            const E = W.get(x) ?? [
              0,
              0,
              0,
              0,
              0,
              0
            ];
            E[2] += d * u / 3, W.set(x, E), ie.set(x, (ie.get(x) ?? 0) + d * u / 3);
          }
          continue;
        }
        const h = [
          0,
          0,
          0,
          0
        ];
        for (const [p, g] of Ce) {
          const u = [
            0.25 * (1 - p) * (1 - g),
            0.25 * (1 + p) * (1 - g),
            0.25 * (1 + p) * (1 + g),
            0.25 * (1 - p) * (1 + g)
          ], x = [
            -0.25 * (1 - g),
            0.25 * (1 - g),
            0.25 * (1 + g),
            -0.25 * (1 + g)
          ], E = [
            -0.25 * (1 - p),
            -0.25 * (1 + p),
            0.25 * (1 + p),
            0.25 * (1 - p)
          ], b = [
            0,
            1,
            2
          ].map((C) => x.reduce((S, w, $) => S + w * i[$][C], 0)), y = [
            0,
            1,
            2
          ].map((C) => E.reduce((S, w, $) => S + w * i[$][C], 0)), D = [
            b[1] * y[2] - b[2] * y[1],
            b[2] * y[0] - b[0] * y[2],
            b[0] * y[1] - b[1] * y[0]
          ], T = Math.hypot(D[0], D[1], D[2]);
          for (let C = 0; C < 4; C++) h[C] += u[C] * d * T;
        }
        for (let p = 0; p < 4; p++) {
          const g = M[p], u = W.get(g) ?? [
            0,
            0,
            0,
            0,
            0,
            0
          ];
          u[2] += h[p], W.set(g, u), ie.set(g, (ie.get(g) ?? 0) + h[p]);
        }
      }
      if (c.selfWeight) {
        const d = /* @__PURE__ */ new Set();
        for (const [i, h] of B) c.deckTributario.has(i) && d.add(h);
        const M = (i, h) => {
          const p = W.get(i) ?? [
            0,
            0,
            0,
            0,
            0,
            0
          ];
          p[2] += h, W.set(i, p);
        };
        k.forEach((i, h) => {
          const p = l.get(h) ?? 0;
          if (p && !d.has(h)) {
            if (i.length === 2) {
              const g = e.get(h) ?? 0, u = O[i[0]], x = O[i[1]], E = [
                x[0] - u[0],
                x[1] - u[1],
                x[2] - u[2]
              ];
              let b = Math.hypot(E[0], E[1], E[2]);
              const y = j.get(h);
              if (y) {
                const N = Math.hypot(E[0], E[1]);
                N > 1e-9 && Math.abs(Math.atan2(Math.abs(E[2]), N)) * 180 / Math.PI < 20 && (b = Math.max(b - y[0] - y[1], 0));
              }
              const D = Math.hypot(E[0], E[1], E[2]), T = -g * p * 9.80665 * c.selfWeight, C = [
                E[0] / D,
                E[1] / D,
                E[2] / D
              ], S = b * b / 12, w = [
                C[1] * T,
                -C[0] * T,
                0
              ], $ = (N, q) => {
                const H = W.get(N) ?? [
                  0,
                  0,
                  0,
                  0,
                  0,
                  0
                ];
                W.set(N, [
                  H[0] + q[0],
                  H[1] + q[1],
                  H[2] + q[2],
                  H[3] + q[3],
                  H[4] + q[4],
                  H[5] + q[5]
                ]);
              };
              $(i[0], [
                0,
                0,
                T * b / 2,
                S * w[0],
                S * w[1],
                0
              ]), $(i[1], [
                0,
                0,
                T * b / 2,
                -S * w[0],
                -S * w[1],
                0
              ]);
            } else if (i.length === 4 || i.length === 3) {
              const g = se.get(h) ?? 0, u = i.map((b) => O[b]);
              let x = 0;
              for (let b = 1; b < i.length - 1; b++) {
                const y = [
                  u[b][0] - u[0][0],
                  u[b][1] - u[0][1],
                  u[b][2] - u[0][2]
                ], D = [
                  u[b + 1][0] - u[0][0],
                  u[b + 1][1] - u[0][1],
                  u[b + 1][2] - u[0][2]
                ], T = [
                  y[1] * D[2] - y[2] * D[1],
                  y[2] * D[0] - y[0] * D[2],
                  y[0] * D[1] - y[1] * D[0]
                ];
                x += Math.hypot(T[0], T[1], T[2]) / 2;
              }
              const E = x * g * p * 9.80665 * c.selfWeight;
              for (const b of i) M(b, -E / i.length);
            }
          }
        });
      }
      const ne = [];
      for (const t of c.springs) {
        const d = A.get(t.node);
        d !== void 0 && ne.push({
          node: d,
          dof: t.dof,
          k: t.k
        });
      }
      for (const t of c.areaSprings) {
        const d = B.get(t.id);
        if (d === void 0) {
          c.errors.push(`areaspring ${t.id}: no existe esa cascara`);
          continue;
        }
        ne.push({
          node: -(d + 1),
          dof: t.nodal ? -3 : -1,
          k: t.ks
        });
      }
      if (c.edgeEtabs) {
        const t = c.edgeLineal, d = t ? 1e-4 : 1e-6, M = /* @__PURE__ */ new Set(), i = [];
        k.forEach((p, g) => {
          if (p.length === 3 || p.length === 4) {
            i.push(g);
            for (const u of p) M.add(u);
          }
        });
        let h = 0;
        for (const p of i) {
          const g = k[p], u = g.map((E) => O[E]), x = [
            0,
            1,
            2
          ].map((E) => [
            Math.min(...u.map((b) => b[E])),
            Math.max(...u.map((b) => b[E]))
          ]);
          for (let E = 0; E < O.length; E++) {
            if (g.includes(E)) continue;
            const b = O[E], y = t ? d * Math.max(x[0][1] - x[0][0], x[1][1] - x[1][0], x[2][1] - x[2][0]) : 1e-6;
            if (b[0] < x[0][0] - y || b[0] > x[0][1] + y || b[1] < x[1][0] - y || b[1] > x[1][1] + y || b[2] < x[2][0] - y || b[2] > x[2][1] + y) continue;
            let D = false;
            for (let C = 0; C < g.length && !D; C++) {
              const S = u[C], w = u[(C + 1) % g.length], $ = [
                w[0] - S[0],
                w[1] - S[1],
                w[2] - S[2]
              ], N = $[0] * $[0] + $[1] * $[1] + $[2] * $[2];
              if (N < 1e-24) continue;
              const q = [
                b[0] - S[0],
                b[1] - S[1],
                b[2] - S[2]
              ], H = (q[0] * $[0] + q[1] * $[1] + q[2] * $[2]) / N;
              if (H <= 1e-6 || H >= 1 - 1e-6) continue;
              const ue = [
                q[0] - H * $[0],
                q[1] - H * $[1],
                q[2] - H * $[2]
              ];
              Math.hypot(ue[0], ue[1], ue[2]) <= d * Math.sqrt(N) && (D = true);
            }
            !D || !(t || k.some((C, S) => S !== p && C.includes(E))) || (ne.push({
              node: -(p + 1),
              dof: t ? -4 : -2,
              k: E
            }), h++);
          }
        }
        h && console.log(`[CLI Modeler] edge ${t ? "lineal" : "etabs"}: ${h} nudo(s) colgado(s) atado(s) a su arista (${t ? "lineal" : "Hermite"})`);
      }
      const ee = [];
      for (const t of c.solids) {
        const d = t.pts.map((i) => A.get(i));
        if (d.some((i) => i === void 0)) {
          c.errors.push(`hex ${t.id}: algun nodo inexistente`);
          continue;
        }
        const M = k.length;
        k.push(d), s.set(M, t.E), U.set(M, t.nu), z.set(M, t.E / (2 * (1 + t.nu))), l.set(M, t.rho), ee.push(M);
      }
      o.nodes.val = O, o.elements.val = k, o.nodeInputs.val = {
        supports: oe,
        loads: W,
        masses: le,
        diaphragms: pe,
        cargasPorPatron: be,
        springs: ne
      }, o.springs && (o.springs.val = ne);
      const he = /* @__PURE__ */ new Map(), ce = /* @__PURE__ */ new Map(), Ie = /* @__PURE__ */ new Map(), me = /* @__PURE__ */ new Map(), ae = /* @__PURE__ */ new Map();
      for (const t of c.shells) {
        const d = B.get(t.id);
        if (d === void 0) continue;
        const M = c.shellLoads.get(t.id);
        M !== void 0 && me.set(d, M);
        const i = c.shellAngles.get(t.id);
        i !== void 0 && ae.set(d, i);
        const h = c.shellModsDir.get(t.id);
        if (h) {
          Ie.set(d, h), he.set(d, (h[0] + h[1]) / 2), ce.set(d, (h[3] + h[4]) / 2);
          continue;
        }
        const p = c.shellMods.get(t.id);
        p ? (he.set(d, p[0]), ce.set(d, p[1])) : c.deckSecs.has(t.id) && (he.set(d, 1), ce.set(d, 0));
      }
      if (o.elementInputs.val = {
        elasticities: s,
        shearModuli: z,
        areas: e,
        momentsOfInertiaY: n,
        momentsOfInertiaZ: a,
        torsionalConstants: c.torsionFactor !== 1 ? new Map([
          ...r
        ].map(([t, d]) => [
          t,
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
        sectionShapes: m,
        localAngles: L,
        shearAreasY: P,
        shearAreasZ: _,
        momentReleases: v,
        endOffsets: j,
        plateFormulations: R,
        deckSections: V,
        frameLoads: J,
        frameLoadsPorPatron: (() => {
          const t = {
            Dead: J
          }, d = /* @__PURE__ */ new Map();
          k.forEach((M, i) => {
            if (M.length === 2) {
              const h = c.frames.find((p) => A.get(p.nI) === M[0] && A.get(p.nJ) === M[1]);
              h && d.set(h.id, i);
            }
          });
          for (const [M, i] of c.frameLoadsPat) {
            const h = /* @__PURE__ */ new Map();
            for (const [p, g] of i) {
              const u = d.get(p);
              u !== void 0 && h.set(u, g);
            }
            t[M] = h;
          }
          return t;
        })(),
        combos: c.combos,
        fcExport: c.fc,
        areaSpringsExport: new Map(c.areaSprings.map((t) => [
          B.get(t.id),
          {
            ks: t.ks,
            nodal: t.nodal,
            comp: !!t.comp
          }
        ]).filter(([t]) => t !== void 0)),
        meshAtIntersections: c.meshCross,
        solidIncompatible: c.solidIncompatible,
        selfWeight: c.selfWeight,
        etabsWallJoint: c.etabsWallJoint,
        areaObjects: c.areaObjs.map((t) => ({
          nodes: t.pts.map((d) => A.get(d)).filter((d) => d !== void 0),
          cells: t.cells.map((d) => B.get(d)).filter((d) => d !== void 0),
          q: t.cells.map((d) => c.shellLoads.get(d)).find((d) => d !== void 0),
          ang: t.cells.map((d) => c.shellAngles.get(d)).find((d) => d !== void 0)
        })).filter((t) => t.nodes.length === 4 && t.cells.length > 0)
      }, c.doSolve && ee.length > 0 && ee.length === k.length) try {
        const t = s.get(ee[0]) ?? 25e6, d = U.get(ee[0]) ?? 0.2;
        ee.some((g) => Math.abs((s.get(g) ?? t) - t) > 1e-9 * t || Math.abs((U.get(g) ?? d) - d) > 1e-12) && c.errors.push("hex: hex8Solve lleva UN material; los solidos tienen E o nu distintos y se usa el del primero");
        const M = /* @__PURE__ */ new Map();
        for (const [g, u] of o.nodeInputs.val.supports ?? []) M.set(g, [
          !!u[0],
          !!u[1],
          !!u[2]
        ]);
        const i = /* @__PURE__ */ new Map();
        for (const [g, u] of Je({
          Dead: W,
          ...Object.fromEntries(te)
        })) i.set(g, [
          u[0] ?? 0,
          u[1] ?? 0,
          u[2] ?? 0
        ]);
        const h = Ge({
          nodes: O,
          elements: k,
          E: t,
          nu: d,
          supports: M,
          loads: i,
          incompatible: c.solidIncompatible
        }), p = /* @__PURE__ */ new Map();
        h.displacements.forEach(([g, u, x], E) => p.set(E, [
          g,
          u,
          x,
          0,
          0,
          0
        ])), o.deformOutputs.val = {
          deformations: p,
          reactions: /* @__PURE__ */ new Map()
        }, o.analyzeOutputs.val = {
          solidStress: h.stressPerElement,
          solidVonMises: h.vonMisesPerElement
        }, console.log(`[CLI Modeler] Solve OK \u2014 ${k.length} solidos H8, ${O.length} nodos (${h.elapsedMs.toFixed(0)} ms)`);
      } catch (t) {
        c.errors.push(`hex8Solve: ${(t == null ? void 0 : t.message) ?? t}`);
      }
      else if (c.doSolve && O.length && k.length) try {
        window.__hekatanCliSprings = ne;
        const t = Je({
          Dead: W,
          ...Object.fromEntries(te)
        });
        o.deformOutputs.val = Ke(O, k, {
          ...o.nodeInputs.val,
          loads: t
        }, o.elementInputs.val, ne.length ? ne : void 0);
        try {
          o.analyzeOutputs.val = Ve(O, k, o.elementInputs.val, o.deformOutputs.val);
        } catch (d) {
          console.warn("[CLI Modeler] analyze:", (d == null ? void 0 : d.message) ?? d);
        }
        if (c.areaSprings.length > 0) try {
          const d = o.deformOutputs.val.deformations, M = o.analyzeOutputs.val ?? {}, i = M.pressure instanceof Map ? M.pressure : /* @__PURE__ */ new Map();
          let h = 0, p = 0;
          for (const g of c.areaSprings) {
            const u = B.get(g.id);
            if (u === void 0) continue;
            const E = k[u].map((b) => {
              var _a2;
              const y = ((_a2 = d.get(b)) == null ? void 0 : _a2[2]) ?? 0, D = g.ks * y;
              return D < h && (h = D), D > p && (p = D), D;
            });
            i.set(u, E);
          }
          i.size > 0 && (M.pressure = i, M.colorMapRanges = {
            ...M.colorMapRanges ?? {},
            pressure: [
              p,
              h
            ]
          }, o.analyzeOutputs.val = M, console.log(`[CLI Modeler] presi\xF3n Winkler: ${i.size} shells, \u03C3 ${h.toFixed(0)}..${p.toFixed(0)} kN/m\xB2`));
        } catch (d) {
          console.warn("[CLI Modeler] presi\xF3n:", (d == null ? void 0 : d.message) ?? d);
        }
        if (ee.length > 0) try {
          const d = o.deformOutputs.val.deformations, M = /* @__PURE__ */ new Map(), i = /* @__PURE__ */ new Map();
          for (const h of ee) {
            const p = k[h], g = p.map((E) => O[E]), u = p.flatMap((E) => {
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
            }), x = Ze(g, s.get(h) ?? 25e6, U.get(h) ?? 0.2, u, c.solidIncompatible);
            M.set(h, x.stress), i.set(h, x.vonMises);
          }
          o.analyzeOutputs.val = {
            ...o.analyzeOutputs.val ?? {},
            solidStress: M,
            solidVonMises: i
          };
        } catch (d) {
          console.warn("[CLI Modeler] tensiones de solidos:", (d == null ? void 0 : d.message) ?? d);
        }
        console.log("[CLI Modeler] Solve OK \u2014", k.length, "elementos,", O.length, "nodos");
      } catch (t) {
        c.errors.push(`solve fall\xF3: ${t.message}`);
      }
      if (o.objects3D.val = [], c.errors.length) {
        console.warn("[CLI Modeler] Errores:");
        for (const t of c.errors) console.warn("  -", t);
      }
      window.__hekatanCliErrors = c.errors;
      let de = 0, we = 0;
      const G = o.deformOutputs.val;
      if ((_a = G == null ? void 0 : G.deformations) == null ? void 0 : _a.size) for (const [, t] of G.deformations) Math.abs(t[2]) > Math.abs(de) && (de = t[2]);
      if ((_b = G == null ? void 0 : G.reactions) == null ? void 0 : _b.size) for (const [, t] of G.reactions) we += t[2] || 0;
      window.__hekatanCliVista = c.vista ?? null, window.__hekatanCliStats = {
        nodes: O.length,
        frames: c.frames.length,
        shells: c.shells.length,
        supports: oe.size,
        loads: W.size,
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
