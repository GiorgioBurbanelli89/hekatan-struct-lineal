import { i as Ne, t as qe, c as Be, d as _e, a as Pe, b as Ue } from "./cadSections-Cc6U2MoW.js";
import { c as Je } from "./cargasPorCaso-B_GZ_-rO.js";
import { h as Ye, a as Ge, __tla as __tla_0 } from "./h8-Dq5Es-cV.js";
import { a as Ze, __tla as __tla_1 } from "./analyze-DWlgMbqF.js";
import { m as Ve, d as He, __tla as __tla_2 } from "./didacticCpp-Czy7NlhT.js";
let cs, Ke;
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
  function je(l) {
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
    const T = [
      false,
      false,
      false,
      false,
      false,
      false
    ], c = t.split(/[\s,]+/).filter(Boolean);
    if (c.length > 1 && c.length <= 6 && c.every((A) => A === "0" || A === "1")) return c.forEach((A, _) => {
      T[_] = A === "1";
    }), T;
    for (const A of c) De[A] !== void 0 && (T[De[A]] = true);
    if (/^[01]+$/.test(t) && t.length <= 6) for (let A = 0; A < t.length; A++) T[A] = t[A] === "1";
    return T;
  }
  Ke = function(l) {
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
    let T = null, c = 0, A = 0, _ = 0;
    const S = l.split(/\r?\n/);
    for (let P = 0; P < S.length; P++) {
      let k = S[P].trim();
      if (!k || k.startsWith("#") || k.startsWith("//")) continue;
      k = k.replace(/[;]+$/, "");
      const o = k.split(/\s+/), O = o[0].toLowerCase();
      if (O === "nodes" && o.length === 1) {
        T = "nodes";
        continue;
      }
      if ((O === "elements" || O === "frames") && o.length === 1) {
        T = "elements";
        continue;
      }
      if (O === "areas" && o.length === 1) {
        T = "areas";
        continue;
      }
      if (O === "supports" && o.length === 1) {
        T = "supports";
        continue;
      }
      if (O === "loads" && o.length === 1) {
        T = "loads";
        continue;
      }
      if (O === "springs" && o.length === 1) {
        T = "springs";
        continue;
      }
      if (T && /^[\-\d]/.test(o[0])) {
        const e = o.map(parseFloat);
        if (T === "nodes" && e.length >= 3) {
          c++, t.nodes.set(c, [
            e[0],
            e[1],
            e[2]
          ]);
          continue;
        }
        if (T === "elements" && e.length >= 2) {
          A++, t.frames.push({
            id: A,
            nI: e[0] + 1,
            nJ: e[1] + 1,
            E: 25e6,
            A: 0.16,
            I: 21e-4
          });
          continue;
        }
        if (T === "areas" && e.length >= 4) {
          _++, t.shells.push({
            id: _,
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
        if (T === "loads" && e.length >= 4) {
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
        if (T === "springs" && e.length >= 3) {
          t.springs.push({
            node: e[0],
            dof: e[1],
            k: e[2]
          });
          continue;
        }
      }
      if (T === "supports" && /^\d/.test(o[0])) {
        const e = parseInt(o[0], 10), n = o.slice(1).join(" ");
        t.supports.set(e, je(n));
        continue;
      }
      T && !/^[\-\d]/.test(o[0]) && (T = null);
      try {
        switch (O) {
          case "node":
          case "n": {
            const e = parseInt(o[1], 10), n = parseFloat(o[2]), a = parseFloat(o[3]), r = parseFloat(o[4]);
            !isFinite(e) || !isFinite(n) || !isFinite(a) || !isFinite(r) ? t.errors.push(`L${P + 1}: node mal formado: ${k}`) : t.nodes.set(e, [
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
            const e = parseInt(o[1], 10), n = parseInt(o[2], 10), a = parseInt(o[3], 10), r = parseFloat(o[4] ?? "25e6"), d = parseFloat(o[5] ?? "0.16"), M = parseFloat(o[6] ?? "0.001"), F = o[7] !== void 0 ? parseFloat(o[7]) : void 0, p = o[8] !== void 0 ? parseFloat(o[8]) : void 0, C = o[9] !== void 0 ? parseFloat(o[9]) : void 0, w = o[10] !== void 0 ? parseFloat(o[10]) : void 0, X = o[11] !== void 0 ? parseFloat(o[11]) : void 0, W = o[12] !== void 0 ? parseFloat(o[12]) : void 0, Z = o.indexOf("#"), J = Z >= 0 && o[Z + 1] ? o[Z + 1] : void 0;
            t.frames.push({
              id: e,
              nI: n,
              nJ: a,
              E: r,
              A: d,
              I: M,
              Iy: F,
              J: p,
              nu: C,
              rho: w,
              D: X,
              B: W,
              sec: J
            });
            break;
          }
          case "cftc": {
            const e = parseInt(o[1], 10), n = parseFloat(o[2] ?? ""), a = parseFloat(o[3] ?? ""), r = parseFloat(o[4] ?? "25e6"), d = parseFloat(o[5] ?? "0.2"), M = parseFloat(o[6] ?? "2.4");
            isFinite(e) && n > 0 && a > 0 && a < n / 2 && r > 0 ? t.frameCftc.set(e, {
              D: n,
              t: a,
              Ec: r,
              nuC: isFinite(d) ? d : 0.2,
              rhoC: isFinite(M) && M >= 0 ? M : 2.4
            }) : t.errors.push(`cftc ${o[1]}: hace falta D t (m) y Ec (kN/m2), con t < D/2`);
            break;
          }
          case "isec":
          case "perfili": {
            const e = parseInt(o[1], 10), n = o.slice(2, 8).map((C) => parseFloat(C)), [a, r, d, M] = n, F = isFinite(n[4]) ? n[4] : r, p = isFinite(n[5]) ? n[5] : d;
            isFinite(e) && a > 0 && r > 0 && d > 0 && M > 0 && F > 0 && p > 0 && d + p < a && M < Math.min(r, F) ? t.frameISec.set(e, {
              d: a,
              bf: r,
              tf: d,
              tw: M,
              t2b: F,
              tfb: p
            }) : t.errors.push(`isec ${o[1]}: hace falta d bf tf tw [t2b tfb] (m), con tf+tfb < d y tw < bf`);
            break;
          }
          case "tubo":
          case "tube": {
            const e = parseInt(o[1], 10), [n, a, r, d] = o.slice(2, 6).map((M) => parseFloat(M));
            isFinite(e) && n > 0 && a > 0 && r > 0 && d > 0 && d < n / 2 && r < a / 2 ? t.frameTube.set(e, {
              b: n,
              h: a,
              tf: r,
              tw: d
            }) : t.errors.push(`tubo ${o[1]}: hace falta b h tf tw (m), con tw < b/2 y tf < h/2`);
            break;
          }
          case "canal":
          case "channel": {
            const e = parseInt(o[1], 10), [n, a, r, d] = o.slice(2, 6).map((M) => parseFloat(M));
            isFinite(e) && n > 0 && a > 0 && r > 0 && d > 0 && 2 * r < n && d < a ? t.frameCanal.set(e, {
              d: n,
              bf: a,
              tf: r,
              tw: d
            }) : t.errors.push(`canal ${o[1]}: hace falta d bf tf tw (m), con 2\xB7tf < d y tw < bf`);
            break;
          }
          case "dosl":
          case "2l": {
            const e = parseInt(o[1], 10), [n, a, r, d, M] = o.slice(2, 7).map((p) => parseFloat(p)), F = (a - (M || 0)) / 2;
            isFinite(e) && n > 0 && a > 0 && r > 0 && d > 0 && M >= 0 && F > d && r < n ? t.frameDosL.set(e, {
              d: n,
              t2: a,
              tf: r,
              tw: d,
              dis: M
            }) : t.errors.push(`dosl ${o[1]}: hace falta d t2 tf tw dis (m), con (t2 \u2212 dis)/2 > tw`);
            break;
          }
          case "cft": {
            const e = parseInt(o[1], 10), n = o.slice(2).map((W) => parseFloat(W)), a = n.length >= 5 && n[3] < 1 && n[4] >= 1, r = n[0], d = n[1], M = n[2], F = a ? n[3] : n[2], p = a ? 4 : 3, C = isFinite(n[p]) ? n[p] : 25e6, w = isFinite(n[p + 1]) ? n[p + 1] : 0.2, X = isFinite(n[p + 2]) ? n[p + 2] : 2.4;
            isFinite(e) && r > 0 && d > 0 && M > 0 && F > 0 && F < r / 2 && M < d / 2 && C > 0 ? t.frameCft.set(e, {
              b: r,
              h: d,
              t: M,
              tw: F,
              Ec: C,
              nuC: w,
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
            if (n.length === 2 && n.every((r) => /^(pin|fix|libre|rigido)$/.test(r))) n.forEach((r, d) => {
              (r === "pin" || r === "libre") && (a[d * 6 + 4] = true, a[d * 6 + 5] = true);
            });
            else {
              const r = n.filter((d) => d === "0" || d === "1");
              if (r.length !== 12) {
                t.errors.push(`release ${e}: hacen falta 12 banderas (U1 U2 U3 R1 R2 R3 en I y en J), llegaron ${r.length}`);
                break;
              }
              for (let d = 0; d < 12; d++) a[d] = r[d] === "1";
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
            ], a = parseFloat(o[6] ?? "0.20"), r = parseFloat(o[7] ?? "25e6"), d = o[9] !== void 0 ? parseFloat(o[9]) : void 0, M = d !== void 0 && isFinite(d) ? d : void 0;
            if (t.shells.push({
              id: e,
              pts: n,
              t: a,
              E: r,
              rho: M
            }), o[8] !== void 0) {
              const F = parseFloat(o[8]);
              isFinite(F) && F !== 0 && t.shellLoads.set(e, F);
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
            const e = o.slice(1).map((w) => parseInt(w, 10));
            if (e.length < 7 || e.some((w) => !isFinite(w))) {
              t.errors.push('areaobj: se esperaba "areaobj ID n1 n2 n3 n4 desdeShell hastaShell"');
              break;
            }
            const [n, a, r, d, M, F, p] = e, C = [];
            for (let w = F; w <= p; w++) C.push(w);
            t.areaObjs.push({
              id: n,
              pts: [
                a,
                r,
                d,
                M
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
            t.supports.set(e, je(n));
            break;
          }
          case "load":
          case "l": {
            const e = parseInt(o[1], 10), n = parseFloat(o[2] ?? "0"), a = parseFloat(o[3] ?? "0"), r = parseFloat(o[4] ?? "0"), d = parseFloat(o[5] ?? "0"), M = parseFloat(o[6] ?? "0"), F = parseFloat(o[7] ?? "0"), p = o[8] && isNaN(parseFloat(o[8])) ? o[8] : "Dead";
            /^dead$/i.test(p) ? t.loads.set(e, [
              n,
              a,
              r,
              d,
              M,
              F
            ]) : (t.loadsPat.has(p) || t.loadsPat.set(p, /* @__PURE__ */ new Map()), t.loadsPat.get(p).set(e, [
              n,
              a,
              r,
              d,
              M,
              F
            ]));
            break;
          }
          case "frameload":
          case "fl": {
            const e = parseInt(o[1], 10), n = parseFloat(o[2] ?? "0"), a = parseFloat(o[3] ?? "0"), r = parseFloat(o[4] ?? "0"), d = o[5] && isNaN(parseFloat(o[5])) ? o[5] : "Dead", M = /^dead$/i.test(d) ? t.frameLoads : t.frameLoadsPat.get(d) ?? (t.frameLoadsPat.set(d, /* @__PURE__ */ new Map()), t.frameLoadsPat.get(d)), F = M.get(e) ?? [
              0,
              0,
              0
            ];
            M.set(e, [
              F[0] + n,
              F[1] + a,
              F[2] + r
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
            Number.isFinite(e) && Number.isFinite(n) ? t.masses.set(e, (t.masses.get(e) ?? 0) + n) : t.errors.push(`L${P + 1}: mass necesita <nudo> <toneladas>`);
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
            t.errors.push(`L${P + 1}: comando desconocido "${O}"`);
        }
      } catch (e) {
        t.errors.push(`L${P + 1}: error "${k}" \u2014 ${e.message}`);
      }
    }
    return t;
  };
  const Qe = `# CLI Modeler \u2014 escrib\xED comandos para construir un modelo
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
`, Y = (l, t) => [
    l[0] - t[0],
    l[1] - t[1],
    l[2] - t[2]
  ], de = (l, t) => l[0] * t[0] + l[1] * t[1] + l[2] * t[2], we = (l, t) => [
    l[1] * t[2] - l[2] * t[1],
    l[2] * t[0] - l[0] * t[2],
    l[0] * t[1] - l[1] * t[0]
  ], V = (l) => Math.hypot(l[0], l[1], l[2]), ie = (l, t) => [
    l[0] * t,
    l[1] * t,
    l[2] * t
  ];
  function Xe(l, t) {
    const T = l.shellModsDir.get(t);
    return !!T && Math.abs(T[3]) < 1e-12 && Math.abs(T[4]) < 1e-12 && Math.abs(T[5]) < 1e-12;
  }
  function es(l, t = 200, T) {
    const c = [
      0,
      1,
      2
    ].map((p) => (l[0][p] + l[1][p] + l[2][p] + l[3][p]) / 4);
    let A = Y(l[1], l[0]), _ = we(A, Y(l[3], l[0]));
    _ = ie(_, 1 / V(_)), A = ie(A, 1 / V(A));
    const S = we(_, A), P = l.map((p) => [
      de(Y(p, c), A),
      de(Y(p, c), S)
    ]);
    let k = [
      0,
      1,
      2,
      3
    ];
    if (T) {
      const p = [
        0,
        1,
        2,
        3
      ].map((C) => {
        const w = Y(l[(C + 1) % 4], l[C]);
        return Math.abs(de(w, T)) / V(w);
      });
      k = [
        0,
        1,
        2,
        3
      ].sort((C, w) => p[C] - p[w]).slice(0, 2);
    }
    const o = P.map((p) => p[0]), O = P.map((p) => p[1]), e = Math.min(...o), n = Math.max(...o), a = Math.min(...O), r = Math.max(...O), d = [
      0,
      1,
      2,
      3
    ].map(() => ({
      pts: [],
      dA: 0
    }));
    let M = 0;
    for (let p = 0; p < t; p++) for (let C = 0; C < t; C++) {
      const w = e + (n - e) * (p + 0.5) / t, X = a + (r - a) * (C + 0.5) / t;
      let W = 0, Z = 0;
      for (let q = 0; q < 4; q++) {
        const U = P[q], H = P[(q + 1) % 4];
        (H[0] - U[0]) * (X - U[1]) - (H[1] - U[1]) * (w - U[0]) >= 0 ? W++ : Z++;
      }
      if (W !== 4 && Z !== 4) continue;
      let J = k[0], R = 1 / 0;
      for (const q of k) {
        const U = P[q], H = P[(q + 1) % 4], se = H[0] - U[0], B = H[1] - U[1], fe = se * se + B * B, re = Math.max(0, Math.min(1, ((w - U[0]) * se + (X - U[1]) * B) / fe)), K = Math.hypot(w - (U[0] + re * se), X - (U[1] + re * B));
        K < R && (R = K, J = q);
      }
      d[J].pts.push([
        c[0] + w * A[0] + X * S[0],
        c[1] + w * A[1] + X * S[1],
        c[2] + w * A[2] + X * S[2]
      ]), M++;
    }
    const F = 0.5 * V(we(Y(l[2], l[0]), Y(l[3], l[1])));
    for (const p of d) p.dA = M ? F / M : 0;
    return d;
  }
  function ss(l, t) {
    if (!(t > 0)) return;
    const T = 1e-6, c = (O) => l.nodes.get(O);
    let A = Math.max(0, ...l.nodes.keys()) + 1, _ = l.shells.reduce((O, e) => Math.max(O, e.id), 0) + 1;
    const S = (O) => {
      for (const [n, a] of l.nodes) if (V(Y(a, O)) < T) return n;
      const e = A++;
      return l.nodes.set(e, [
        O[0],
        O[1],
        O[2]
      ]), e;
    }, P = (O, e) => {
      const n = l.shellModsDir.get(O);
      n && l.shellModsDir.set(e, [
        ...n
      ]);
      const a = l.shellMods.get(O);
      a && l.shellMods.set(e, [
        ...a
      ]);
      const r = l.shellLoads.get(O);
      r !== void 0 && l.shellLoads.set(e, r);
      const d = l.shellTypes.get(O);
      d !== void 0 && l.shellTypes.set(e, d);
      const M = l.shellAngles.get(O);
      M !== void 0 && l.shellAngles.set(e, M);
    }, k = [];
    let o = 0;
    for (const O of l.shells) {
      if (O.pts.length !== 4) {
        k.push(O);
        continue;
      }
      const e = O.pts.map(c);
      if (e.some((p) => !p)) {
        k.push(O);
        continue;
      }
      const n = (V(Y(e[1], e[0])) + V(Y(e[2], e[3]))) / 2, a = (V(Y(e[3], e[0])) + V(Y(e[2], e[1]))) / 2, r = Math.max(1, Math.ceil(n / t - 1e-9)), d = Math.max(1, Math.ceil(a / t - 1e-9));
      if (r === 1 && d === 1) {
        k.push(O);
        continue;
      }
      const M = (p, C) => [
        0,
        1,
        2
      ].map((w) => e[0][w] * (1 - p) * (1 - C) + e[1][w] * p * (1 - C) + e[2][w] * p * C + e[3][w] * (1 - p) * C), F = [];
      for (let p = 0; p <= r; p++) {
        const C = [];
        for (let w = 0; w <= d; w++) C.push(S(M(p / r, w / d)));
        F.push(C);
      }
      for (let p = 0; p < r; p++) for (let C = 0; C < d; C++) {
        const w = p === 0 && C === 0 ? O.id : _++;
        k.push({
          ...O,
          id: w,
          pts: [
            F[p][C],
            F[p + 1][C],
            F[p + 1][C + 1],
            F[p][C + 1]
          ]
        }), w !== O.id && P(O.id, w);
      }
      o++;
    }
    o && (l.shells = k, console.log(`[CLI Modeler] automesh ${t} m: ${o} pano(s) partido(s) -> ${l.shells.length} cascaras, ${l.nodes.size} nudos`));
  }
  function ts(l) {
    const T = (a) => l.nodes.get(a), c = [
      ...l.nodes.keys()
    ], A = (a, r, d) => {
      const M = Y(r, a), F = V(M), p = ie(M, 1 / F), C = [];
      for (const w of c) {
        if (d.includes(w)) continue;
        const X = Y(T(w), a), W = de(X, p);
        W > 1e-6 && W < F - 1e-6 && V(Y(X, ie(p, W))) < 1e-4 && C.push(W / F);
      }
      return C.sort((w, X) => w - X);
    }, _ = (a, r) => {
      const d = [];
      for (const M of a) r.some((F) => Math.abs(M - F) < 1e-5) && !d.some((F) => Math.abs(M - F) < 1e-5) && d.push(M);
      return d;
    }, S = (a) => {
      for (const r of c) if (V(Y(T(r), a)) < 1e-4) return r;
    };
    let P = l.shells.reduce((a, r) => Math.max(a, r.id), 0) + 1;
    const k = [], o = (a, r) => {
      const d = l.shellModsDir.get(a);
      d && l.shellModsDir.set(r, [
        ...d
      ]);
      const M = l.shellMods.get(a);
      M && l.shellMods.set(r, [
        ...M
      ]);
      const F = l.shellLoads.get(a);
      F !== void 0 && l.shellLoads.set(r, F);
      const p = l.shellTypes.get(a);
      p !== void 0 && l.shellTypes.set(r, p);
      const C = l.shellAngles.get(a);
      C !== void 0 && l.shellAngles.set(r, C);
    };
    for (const a of l.shells) {
      if (!Xe(l, a.id) || a.pts.length !== 4 || a.pts.some((J) => !l.nodes.has(J))) {
        k.push(a);
        continue;
      }
      const r = a.pts.map(T), d = A(r[0], r[1], a.pts), M = A(r[2], r[3], a.pts).map((J) => 1 - J), F = A(r[1], r[2], a.pts), p = A(r[3], r[0], a.pts).map((J) => 1 - J);
      let C = [
        0,
        ..._(d, M),
        1
      ], w = [
        0,
        ..._(F, p),
        1
      ];
      if (C.length === 2 && w.length === 2) {
        k.push(a);
        continue;
      }
      const X = (J, R) => [
        0,
        1,
        2
      ].map((q) => (1 - J) * (1 - R) * r[0][q] + J * (1 - R) * r[1][q] + J * R * r[2][q] + (1 - J) * R * r[3][q]);
      let W = w.map((J) => C.map((R) => S(X(R, J))));
      if (W.some((J) => J.some((R) => R === void 0)) && (C.length >= w.length ? w = [
        0,
        1
      ] : C = [
        0,
        1
      ], W = w.map((J) => C.map((R) => S(X(R, J)))), W.some((J) => J.some((R) => R === void 0)))) {
        k.push(a);
        continue;
      }
      let Z = true;
      for (let J = 0; J < w.length - 1; J++) for (let R = 0; R < C.length - 1; R++) {
        const q = [
          W[J][R],
          W[J][R + 1],
          W[J + 1][R + 1],
          W[J + 1][R]
        ], U = Z ? a.id : P++;
        Z || o(a.id, U), Z = false, k.push({
          id: U,
          pts: q,
          t: a.t,
          E: a.E,
          rho: a.rho
        });
      }
    }
    l.shells = k;
    const O = 9.80665, e = (a, r) => {
      const d = l.loads.get(a) ?? [
        0,
        0,
        0,
        0,
        0,
        0
      ];
      l.loads.set(a, [
        d[0] + r[0],
        d[1] + r[1],
        d[2] + r[2],
        d[3] + r[3],
        d[4] + r[4],
        d[5] + r[5]
      ]);
    }, n = (a, r) => {
      const d = Y(r, a), M = V(d), F = ie(d, 1 / M);
      return l.frames.filter((p) => [
        p.nI,
        p.nJ
      ].every((C) => {
        const w = l.nodes.get(C);
        if (!w) return false;
        const X = Y(w, a), W = de(X, F);
        return W > -1e-4 && W < M + 1e-4 && V(Y(X, ie(F, W))) < 1e-4;
      }));
    };
    for (const a of l.shells) {
      if (!Xe(l, a.id) || a.pts.length !== 4) continue;
      const r = l.selfWeight ? (a.rho ?? 2.45) * a.t * O * l.selfWeight : 0, d = l.shellLoads.get(a.id) ?? 0, M = -r + d;
      if (Math.abs(M) < 1e-15) continue;
      const F = a.pts.map(T);
      let p;
      if (l.deckOneWay) {
        const w = Y(F[1], F[0]);
        let X = we(w, Y(F[3], F[0]));
        X = ie(X, 1 / V(X));
        const W = ie(w, 1 / V(w)), Z = we(X, W), J = (l.shellAngles.get(a.id) ?? 0) * Math.PI / 180;
        p = [
          0,
          1,
          2
        ].map((R) => Math.cos(J) * W[R] + Math.sin(J) * Z[R]);
      }
      const C = es(F, 200, p);
      for (let w = 0; w < 4; w++) {
        const { pts: X, dA: W } = C[w];
        if (!X.length) continue;
        const Z = F[w], J = F[(w + 1) % 4], R = n(Z, J);
        if (!R.length) {
          const B = M * W * X.length;
          e(a.pts[w], [
            0,
            0,
            B / 2,
            0,
            0,
            0
          ]), e(a.pts[(w + 1) % 4], [
            0,
            0,
            B / 2,
            0,
            0,
            0
          ]);
          continue;
        }
        const q = Y(J, Z), U = V(q), H = ie(q, 1 / U), se = X.map((B) => de(Y(B, Z), H));
        for (const B of R) {
          const fe = T(B.nI), re = T(B.nJ), K = de(Y(fe, Z), H), Me = de(Y(re, Z), H), pe = Math.min(K, Me), Q = Math.max(K, Me), ce = Q - pe;
          if (ce < 1e-9) continue;
          const te = Q >= U - 1e-6, ae = ie(Y(re, fe), 1 / ce), oe = we(ae, [
            0,
            0,
            1
          ]);
          let he = 0, ue = 0, Fe = 0, me = 0;
          for (const ge of se) {
            if (ge < pe - 1e-9 || (te ? ge > Q + 1e-9 : ge >= Q - 1e-9)) continue;
            let le = ge - pe;
            K > Me && (le = ce - le);
            const s = le / ce;
            he += 1 - 3 * s * s + 2 * s * s * s, ue += ce * (s - 2 * s * s + s * s * s), Fe += 3 * s * s - 2 * s * s * s, me += ce * (-s * s + s * s * s);
          }
          const ee = M * W;
          e(B.nI, [
            0,
            0,
            ee * he,
            oe[0] * ee * ue,
            oe[1] * ee * ue,
            oe[2] * ee * ue
          ]), e(B.nJ, [
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
  cs = {
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
    runModal(l, t, T) {
      var _a;
      const c = t.nodes.val, A = t.elements.val;
      if (!(!c.length || !A.length)) try {
        const _ = Math.max(1, parseInt(window.__hekatanCliModalModes ?? "12", 10) || 12), S = t.nodeInputs.val, P = window.__hekatanCliSprings, k = Ve(c, A, S, t.elementInputs.val, _, 0, 0, 1, (S == null ? void 0 : S.diaphragms) instanceof Map && S.diaphragms.size ? S.diaphragms : void 0, P && P.length ? P : void 0);
        console.log(`[CLI Modeler] Modal OK \u2014 ${k.frequencies.length} modos, T1 = ${k.frequencies[0] ? (1 / k.frequencies[0]).toFixed(5) : "\u2014"} s`), (_a = T == null ? void 0 : T.render) == null ? void 0 : _a.call(T, k, {
          title: "Modal del .heks (masa 3D, como SAP2000)"
        });
      } catch (_) {
        console.error("[CLI Modeler] modal:", (_ == null ? void 0 : _.message) ?? _);
      }
    },
    build(l, t) {
      var _a, _b;
      const T = window.__hekatanCliScript ?? Qe;
      window.__hekatanCliLastScript = T;
      const c = Ke(T);
      c.autoMesh > 0 && ss(c, c.autoMesh), c.deckEtabs && ts(c);
      const A = /* @__PURE__ */ new Map(), _ = /* @__PURE__ */ new Map(), S = [], P = Array.from(c.nodes.keys()).sort((s, f) => s - f);
      for (const s of P) A.set(s, S.length), S.push(c.nodes.get(s));
      const k = [], o = /* @__PURE__ */ new Map(), O = /* @__PURE__ */ new Map(), e = /* @__PURE__ */ new Map(), n = /* @__PURE__ */ new Map(), a = /* @__PURE__ */ new Map(), r = /* @__PURE__ */ new Map(), d = /* @__PURE__ */ new Map(), M = /* @__PURE__ */ new Map(), F = /* @__PURE__ */ new Map(), p = /* @__PURE__ */ new Map(), C = /* @__PURE__ */ new Map(), w = /* @__PURE__ */ new Map(), X = /* @__PURE__ */ new Map(), W = /* @__PURE__ */ new Map(), Z = /* @__PURE__ */ new Map(), J = /* @__PURE__ */ new Map(), R = /* @__PURE__ */ new Map(), q = /* @__PURE__ */ new Map(), U = /* @__PURE__ */ new Map(), H = /* @__PURE__ */ new Map();
      for (const s of c.frames) {
        const f = A.get(s.nI), I = A.get(s.nJ);
        if (f === void 0 || I === void 0) {
          const g = P.length ? `IDs disponibles: ${P.join(", ")}` : "ning\xFAn nodo definido", z = [];
          f === void 0 && z.push(s.nI), I === void 0 && z.push(s.nJ), c.errors.push(`frame ${s.id}: nodo(s) inexistente(s) [${z.join(", ")}] \u2014 ${g}`);
          continue;
        }
        const i = k.length;
        k.push([
          f,
          I
        ]);
        const h = s.nu ?? 0.2;
        o.set(i, s.E), O.set(i, s.E / (2 * (1 + h))), e.set(i, s.A), n.set(i, s.I), a.set(i, s.Iy ?? s.I), r.set(i, s.J ?? 0.14 * Math.pow(Math.sqrt(s.A), 4)), d.set(i, s.rho ?? 2.45), U.set(i, h), s.D !== void 0 && isFinite(s.D) && M.set(i, s.D), s.B !== void 0 && isFinite(s.B) && F.set(i, s.B);
        const m = c.frameAngles.get(s.id);
        m !== void 0 && isFinite(m) && C.set(i, m);
        const b = c.frameReleases.get(s.id);
        b && w.set(i, b);
        const u = c.frameEndOffsets.get(s.id);
        u && X.set(i, u);
        const $ = c.frameLoads.get(s.id);
        $ && J.set(i, $);
        const j = c.frameShearAreas.get(s.id);
        if (j && (q.set(i, j[0]), R.set(i, j[1])), s.sec || s.D !== void 0 && s.B !== void 0) {
          const g = {
            type: "general"
          };
          s.sec && (g.name = s.sec), s.D !== void 0 && isFinite(s.D) && (g.h = s.D), s.B !== void 0 && isFinite(s.B) && (g.b = s.B), p.set(i, g);
        }
        const v = c.frameISec.get(s.id);
        if (v) {
          const g = Ne(v.d, v.bf, v.tf, v.tw, v.t2b, v.tfb);
          e.set(i, g.A), a.set(i, g.Iz), n.set(i, g.Iy), r.set(i, g.J), q.set(i, g.As2), R.set(i, g.As3), M.set(i, v.d), F.set(i, Math.max(v.bf, v.t2b));
          const z = (N) => Math.round(N * 1e4) / 10;
          p.set(i, {
            type: "I",
            h: v.d,
            b: v.bf,
            tf: v.tf,
            tw: v.tw,
            t2b: v.t2b,
            tfb: v.tfb,
            name: s.sec ?? `I${z(v.d)}X${z(v.bf)}X${z(v.tf)}X${z(v.tw)}`
          });
        }
        const y = c.frameTube.get(s.id);
        if (y) {
          const g = qe(y.b, y.h, y.tf, y.tw);
          e.set(i, g.A), a.set(i, g.Iz), n.set(i, g.Iy), r.set(i, g.J), q.set(i, g.As2), R.set(i, g.As3), M.set(i, y.h), F.set(i, y.b);
          const z = (N) => Math.round(N * 1e4) / 10;
          p.set(i, {
            type: "HSS",
            h: y.h,
            b: y.b,
            tf: y.tf,
            tw: y.tw,
            name: s.sec ?? `TUBO${z(y.h)}X${z(y.b)}X${z(y.tf)}X${z(y.tw)}`
          });
        }
        const L = c.frameCanal.get(s.id);
        if (L) {
          const g = Be(L.d, L.bf, L.tf, L.tw);
          e.set(i, g.A), a.set(i, g.Iz), n.set(i, g.Iy), r.set(i, g.J), q.set(i, g.As2), R.set(i, g.As3), M.set(i, L.d), F.set(i, L.bf);
          const z = (N) => Math.round(N * 1e4) / 10;
          p.set(i, {
            type: "C",
            h: L.d,
            b: L.bf,
            tf: L.tf,
            tw: L.tw,
            name: s.sec ?? `C${z(L.d)}X${z(L.bf)}X${z(L.tf)}X${z(L.tw)}`
          });
        }
        const E = c.frameDosL.get(s.id);
        if (E) {
          const g = _e(E.d, E.t2, E.tf, E.tw, E.dis);
          e.set(i, g.A), a.set(i, g.Iz), n.set(i, g.Iy), r.set(i, g.J), q.set(i, g.As2), R.set(i, g.As3), M.set(i, E.d), F.set(i, E.t2);
          const z = (N) => Math.round(N * 1e4) / 10;
          p.set(i, {
            type: "2L",
            h: E.d,
            b: E.t2,
            tf: E.tf,
            tw: E.tw,
            dis: E.dis,
            name: s.sec ?? `2L${z(E.d)}X${z(E.t2)}X${z(E.tf)}X${z(E.tw)}S${z(E.dis)}`
          });
        }
        const x = c.frameCftc.get(s.id);
        if (x) {
          const g = Pe(x.D, x.t, s.E, h, x.Ec, x.nuC);
          e.set(i, g.A), a.set(i, g.Iz), n.set(i, g.Iy), r.set(i, g.J), q.set(i, g.As2), R.set(i, g.As3), M.set(i, x.D), F.set(i, x.D);
          const z = x.D - 2 * x.t, N = Math.PI * z * z / 4, G = Math.PI * x.D * x.D / 4 - N;
          d.set(i, ((s.rho ?? 7.85) * G + x.rhoC * N) / g.A), p.set(i, {
            type: "CFT",
            d: x.D,
            tw: x.t,
            fillE: x.Ec,
            fillRho: x.rhoC,
            steelRho: s.rho ?? 7.85,
            name: s.sec ?? `CFTC ${Math.round(x.D * 1e3)}X${Math.round(x.t * 1e3)}`
          });
        }
        const D = c.frameCft.get(s.id);
        if (D) {
          const g = Ue(D.b, D.h, D.t, s.E, h, D.Ec, D.nuC, D.tw);
          e.set(i, g.A), a.set(i, g.Iz), n.set(i, g.Iy), r.set(i, g.J), q.set(i, g.As2), R.set(i, g.As3), M.set(i, D.h), F.set(i, D.b);
          const z = (D.b - 2 * D.tw) * (D.h - 2 * D.t), N = D.b * D.h - z;
          d.set(i, ((s.rho ?? 7.85) * N + D.rhoC * z) / g.A);
          const G = (ne) => Math.round(ne * 1e3);
          p.set(i, {
            type: "CFT",
            b: D.b,
            h: D.h,
            tw: D.tw,
            tf: D.t,
            fillE: D.Ec,
            fillRho: D.rhoC,
            steelRho: s.rho ?? 7.85,
            name: s.sec ?? `CFT ${G(D.h)}X${G(D.b)}X${G(D.t)}${D.tw !== D.t ? `X${G(D.tw)}` : ""}`
          });
        }
      }
      if (c.meshCross) {
        const s = (b, u) => b[0] * u[0] + b[1] * u[1] + b[2] * u[2], f = [
          o,
          O,
          e,
          n,
          a,
          r,
          d,
          U,
          M,
          F,
          C,
          R,
          q,
          p,
          J
        ], I = (b, u) => {
          for (const $ of f) $.has(b) && $.set(u, $.get(b));
        }, i = (b) => {
          for (let u = 0; u < S.length; u++) if (Math.hypot(S[u][0] - b[0], S[u][1] - b[1], S[u][2] - b[2]) < 1e-6) return u;
          return S.push([
            b[0],
            b[1],
            b[2]
          ]), S.length - 1;
        }, h = (b) => {
          const u = S[b[0]], $ = S[b[1]];
          return [
            Math.min(u[0], $[0]),
            Math.min(u[1], $[1]),
            Math.min(u[2], $[2]),
            Math.max(u[0], $[0]),
            Math.max(u[1], $[1]),
            Math.max(u[2], $[2])
          ];
        };
        let m = 0;
        for (let b = 0; b < k.length; b++) {
          if (k[b].length !== 2) continue;
          const u = h(k[b]);
          for (let $ = b + 1; $ < k.length; $++) {
            if (k[$].length !== 2) continue;
            const [j, v] = k[b], [y, L] = k[$];
            if (j === y || j === L || v === y || v === L) continue;
            const E = h(k[$]);
            if (u[0] > E[3] + 1e-6 || E[0] > u[3] + 1e-6 || u[1] > E[4] + 1e-6 || E[1] > u[4] + 1e-6 || u[2] > E[5] + 1e-6 || E[2] > u[5] + 1e-6) continue;
            const x = S[j], D = S[v], g = S[y], z = S[L], N = [
              D[0] - x[0],
              D[1] - x[1],
              D[2] - x[2]
            ], G = [
              z[0] - g[0],
              z[1] - g[1],
              z[2] - g[2]
            ], ne = [
              x[0] - g[0],
              x[1] - g[1],
              x[2] - g[2]
            ], Le = s(N, N), xe = s(N, G), Ce = s(G, G), ze = s(N, ne), Oe = s(G, ne), $e = Le * Ce - xe * xe;
            if ($e < 1e-10 * Le * Ce) continue;
            const Ie = (xe * Oe - Ce * ze) / $e, ve = (Le * Oe - xe * ze) / $e;
            if (Ie < 1e-6 || Ie > 1 - 1e-6 || ve < 1e-6 || ve > 1 - 1e-6) continue;
            const ye = [
              x[0] + Ie * N[0],
              x[1] + Ie * N[1],
              x[2] + Ie * N[2]
            ], Ae = [
              g[0] + ve * G[0],
              g[1] + ve * G[1],
              g[2] + ve * G[2]
            ];
            if (Math.hypot(ye[0] - Ae[0], ye[1] - Ae[1], ye[2] - Ae[2]) > 1e-6) continue;
            const Te = i(ye);
            for (const be of [
              b,
              $
            ]) {
              const [Re, We] = k[be], Se = k.length;
              k[be] = [
                Re,
                Te
              ], k.push([
                Te,
                We
              ]), I(be, Se);
              const Ee = w.get(be);
              Ee && (w.set(be, [
                ...Ee.slice(0, 6),
                ...Array(6).fill(false)
              ]), w.set(Se, [
                ...Array(6).fill(false),
                ...Ee.slice(6)
              ]));
              const ke = X.get(be);
              ke && (X.set(be, [
                ke[0],
                0,
                ke[2]
              ]), X.set(Se, [
                0,
                ke[1],
                ke[2]
              ]));
            }
            m++;
          }
        }
        m > 0 && console.log(`[CLI Modeler] ${m} cruces de barras partidos con nudo (como ETABS; meshcross 0 lo apaga)`);
      }
      for (const s of c.shells) {
        const f = s.pts.map((m) => A.get(m));
        if (f.some((m) => m === void 0)) {
          c.errors.push(`shell ${s.id}: algun nodo inexistente`);
          continue;
        }
        const I = k.length;
        _.set(s.id, I), k.push(f), o.set(I, s.E), O.set(I, s.E / (2 * 1.2)), H.set(I, s.t), d.set(I, s.rho ?? 2.45), U.set(I, 0.2);
        const i = c.shellTypes.get(s.id);
        i !== void 0 && W.set(I, i);
        const h = c.deckSecs.get(s.id);
        if (h) {
          const m = h.tc + (h.sr > 0 ? h.hr * (h.wrt + h.wrb) / 2 / h.sr : 0);
          H.set(I, h.tc), d.set(I, ((s.rho ?? 2.45) * m + h.w / 9.80665) / h.tc), Z.set(I, {
            ...h
          });
        }
      }
      const se = /* @__PURE__ */ new Map();
      for (const [s, f] of c.supports.entries()) {
        const I = A.get(s);
        I !== void 0 && se.set(I, f);
      }
      const B = /* @__PURE__ */ new Map();
      for (const [s, f] of c.loads.entries()) {
        const I = A.get(s);
        I !== void 0 && B.set(I, [
          ...f
        ]);
      }
      const fe = /* @__PURE__ */ new Map();
      for (const [s, f] of c.diaphragms.entries()) {
        const I = A.get(s);
        I !== void 0 && fe.set(I, f);
      }
      const re = /* @__PURE__ */ new Map();
      for (const [s, f] of c.masses.entries()) {
        const I = A.get(s);
        I !== void 0 && re.set(I, f);
      }
      const K = /* @__PURE__ */ new Map();
      for (const [s, f] of c.loadsPat) {
        const I = /* @__PURE__ */ new Map();
        for (const [i, h] of f) {
          const m = A.get(i);
          m !== void 0 && I.set(m, [
            ...h
          ]);
        }
        K.set(s, I);
      }
      const Me = [
        [
          c.frameLoads,
          B
        ]
      ];
      for (const [s, f] of c.frameLoadsPat) K.has(s) || K.set(s, /* @__PURE__ */ new Map()), Me.push([
        f,
        K.get(s)
      ]);
      for (const [s, f] of Me) if (s.size) {
        const I = (i, h) => {
          const m = f.get(i) ?? [
            0,
            0,
            0,
            0,
            0,
            0
          ];
          f.set(i, [
            m[0] + h[0],
            m[1] + h[1],
            m[2] + h[2],
            m[3] + h[3],
            m[4] + h[4],
            m[5] + h[5]
          ]);
        };
        for (const [i, h] of s.entries()) {
          const m = c.frames.find((D) => D.id === i);
          if (!m) {
            c.errors.push(`frameload ${i}: no existe esa barra`);
            continue;
          }
          const b = A.get(m.nI), u = A.get(m.nJ);
          if (b === void 0 || u === void 0) continue;
          const $ = S[b], j = S[u], v = [
            j[0] - $[0],
            j[1] - $[1],
            j[2] - $[2]
          ], y = Math.hypot(v[0], v[1], v[2]);
          if (y < 1e-9) continue;
          const L = [
            v[0] / y,
            v[1] / y,
            v[2] / y
          ], E = y * y / 12, x = [
            L[1] * h[2] - L[2] * h[1],
            L[2] * h[0] - L[0] * h[2],
            L[0] * h[1] - L[1] * h[0]
          ];
          I(b, [
            h[0] * y / 2,
            h[1] * y / 2,
            h[2] * y / 2,
            E * x[0],
            E * x[1],
            E * x[2]
          ]), I(u, [
            h[0] * y / 2,
            h[1] * y / 2,
            h[2] * y / 2,
            -E * x[0],
            -E * x[1],
            -E * x[2]
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
        const f = c.shellLoads.get(s.id);
        if (!f || c.deckTributario.has(s.id)) continue;
        const I = s.pts.map((m) => A.get(m));
        if (I.some((m) => m === void 0)) {
          c.errors.push(`areaload ${s.id}: algun nodo inexistente`);
          continue;
        }
        const i = I.map((m) => S[m]), h = [
          0,
          0,
          0,
          0
        ];
        for (const [m, b] of ce) {
          const u = [
            0.25 * (1 - m) * (1 - b),
            0.25 * (1 + m) * (1 - b),
            0.25 * (1 + m) * (1 + b),
            0.25 * (1 - m) * (1 + b)
          ], $ = [
            -0.25 * (1 - b),
            0.25 * (1 - b),
            0.25 * (1 + b),
            -0.25 * (1 + b)
          ], j = [
            -0.25 * (1 - m),
            -0.25 * (1 + m),
            0.25 * (1 + m),
            0.25 * (1 - m)
          ], v = [
            0,
            1,
            2
          ].map((x) => $.reduce((D, g, z) => D + g * i[z][x], 0)), y = [
            0,
            1,
            2
          ].map((x) => j.reduce((D, g, z) => D + g * i[z][x], 0)), L = [
            v[1] * y[2] - v[2] * y[1],
            v[2] * y[0] - v[0] * y[2],
            v[0] * y[1] - v[1] * y[0]
          ], E = Math.hypot(L[0], L[1], L[2]);
          for (let x = 0; x < 4; x++) h[x] += u[x] * f * E;
        }
        for (let m = 0; m < 4; m++) {
          const b = I[m], u = B.get(b) ?? [
            0,
            0,
            0,
            0,
            0,
            0
          ];
          u[2] += h[m], B.set(b, u), pe.set(b, (pe.get(b) ?? 0) + h[m]);
        }
      }
      if (c.selfWeight) {
        const f = /* @__PURE__ */ new Set();
        for (const [i, h] of _) c.deckTributario.has(i) && f.add(h);
        const I = (i, h) => {
          const m = B.get(i) ?? [
            0,
            0,
            0,
            0,
            0,
            0
          ];
          m[2] += h, B.set(i, m);
        };
        k.forEach((i, h) => {
          const m = d.get(h) ?? 0;
          if (m && !f.has(h)) {
            if (i.length === 2) {
              const b = e.get(h) ?? 0, u = S[i[0]], $ = S[i[1]], j = [
                $[0] - u[0],
                $[1] - u[1],
                $[2] - u[2]
              ];
              let v = Math.hypot(j[0], j[1], j[2]);
              const y = X.get(h);
              if (y) {
                const N = Math.hypot(j[0], j[1]);
                N > 1e-9 && Math.abs(Math.atan2(Math.abs(j[2]), N)) * 180 / Math.PI < 20 && (v = Math.max(v - y[0] - y[1], 0));
              }
              const L = Math.hypot(j[0], j[1], j[2]), E = -b * m * 9.80665 * c.selfWeight, x = [
                j[0] / L,
                j[1] / L,
                j[2] / L
              ], D = v * v / 12, g = [
                x[1] * E,
                -x[0] * E,
                0
              ], z = (N, G) => {
                const ne = B.get(N) ?? [
                  0,
                  0,
                  0,
                  0,
                  0,
                  0
                ];
                B.set(N, [
                  ne[0] + G[0],
                  ne[1] + G[1],
                  ne[2] + G[2],
                  ne[3] + G[3],
                  ne[4] + G[4],
                  ne[5] + G[5]
                ]);
              };
              z(i[0], [
                0,
                0,
                E * v / 2,
                D * g[0],
                D * g[1],
                0
              ]), z(i[1], [
                0,
                0,
                E * v / 2,
                -D * g[0],
                -D * g[1],
                0
              ]);
            } else if (i.length === 4) {
              const b = H.get(h) ?? 0, u = i.map((v) => S[v]);
              let $ = 0;
              for (let v = 1; v < 3; v++) {
                const y = [
                  u[v][0] - u[0][0],
                  u[v][1] - u[0][1],
                  u[v][2] - u[0][2]
                ], L = [
                  u[v + 1][0] - u[0][0],
                  u[v + 1][1] - u[0][1],
                  u[v + 1][2] - u[0][2]
                ], E = [
                  y[1] * L[2] - y[2] * L[1],
                  y[2] * L[0] - y[0] * L[2],
                  y[0] * L[1] - y[1] * L[0]
                ];
                $ += Math.hypot(E[0], E[1], E[2]) / 2;
              }
              const j = $ * b * m * 9.80665 * c.selfWeight;
              for (const v of i) I(v, -j / 4);
            }
          }
        });
      }
      const te = [];
      for (const s of c.springs) {
        const f = A.get(s.node);
        f !== void 0 && te.push({
          node: f,
          dof: s.dof,
          k: s.k
        });
      }
      for (const s of c.areaSprings) {
        const f = _.get(s.id);
        if (f === void 0) {
          c.errors.push(`areaspring ${s.id}: no existe esa cascara`);
          continue;
        }
        te.push({
          node: -(f + 1),
          dof: s.nodal ? -3 : -1,
          k: s.ks
        });
      }
      if (c.edgeEtabs) {
        const s = /* @__PURE__ */ new Set(), f = [];
        k.forEach((i, h) => {
          if (i.length === 3 || i.length === 4) {
            f.push(h);
            for (const m of i) s.add(m);
          }
        });
        let I = 0;
        for (const i of f) {
          const h = k[i], m = h.map((u) => S[u]), b = [
            0,
            1,
            2
          ].map((u) => [
            Math.min(...m.map(($) => $[u])),
            Math.max(...m.map(($) => $[u]))
          ]);
          for (let u = 0; u < S.length; u++) {
            if (h.includes(u)) continue;
            const $ = S[u];
            if ($[0] < b[0][0] - 1e-6 || $[0] > b[0][1] + 1e-6 || $[1] < b[1][0] - 1e-6 || $[1] > b[1][1] + 1e-6 || $[2] < b[2][0] - 1e-6 || $[2] > b[2][1] + 1e-6) continue;
            let j = false;
            for (let y = 0; y < h.length && !j; y++) {
              const L = m[y], E = m[(y + 1) % h.length], x = [
                E[0] - L[0],
                E[1] - L[1],
                E[2] - L[2]
              ], D = x[0] * x[0] + x[1] * x[1] + x[2] * x[2];
              if (D < 1e-24) continue;
              const g = [
                $[0] - L[0],
                $[1] - L[1],
                $[2] - L[2]
              ], z = (g[0] * x[0] + g[1] * x[1] + g[2] * x[2]) / D;
              if (z <= 1e-6 || z >= 1 - 1e-6) continue;
              const N = [
                g[0] - z * x[0],
                g[1] - z * x[1],
                g[2] - z * x[2]
              ];
              Math.hypot(N[0], N[1], N[2]) <= 1e-6 * Math.sqrt(D) && (j = true);
            }
            !j || !k.some((y, L) => L !== i && y.includes(u)) || (te.push({
              node: -(i + 1),
              dof: -2,
              k: u
            }), I++);
          }
        }
        I && console.log(`[CLI Modeler] edge etabs: ${I} nudo(s) colgado(s) atado(s) a su arista (Hermite)`);
      }
      const ae = [];
      for (const s of c.solids) {
        const f = s.pts.map((i) => A.get(i));
        if (f.some((i) => i === void 0)) {
          c.errors.push(`hex ${s.id}: algun nodo inexistente`);
          continue;
        }
        const I = k.length;
        k.push(f), o.set(I, s.E), U.set(I, s.nu), O.set(I, s.E / (2 * (1 + s.nu))), d.set(I, s.rho), ae.push(I);
      }
      t.nodes.val = S, t.elements.val = k, t.nodeInputs.val = {
        supports: se,
        loads: B,
        masses: re,
        diaphragms: fe,
        springs: te
      }, t.springs && (t.springs.val = te);
      const oe = /* @__PURE__ */ new Map(), he = /* @__PURE__ */ new Map(), ue = /* @__PURE__ */ new Map(), Fe = /* @__PURE__ */ new Map(), me = /* @__PURE__ */ new Map();
      for (const s of c.shells) {
        const f = _.get(s.id);
        if (f === void 0) continue;
        const I = c.shellLoads.get(s.id);
        I !== void 0 && Fe.set(f, I);
        const i = c.shellAngles.get(s.id);
        i !== void 0 && me.set(f, i);
        const h = c.shellModsDir.get(s.id);
        if (h) {
          ue.set(f, h), oe.set(f, (h[0] + h[1]) / 2), he.set(f, (h[3] + h[4]) / 2);
          continue;
        }
        const m = c.shellMods.get(s.id);
        m ? (oe.set(f, m[0]), he.set(f, m[1])) : c.deckSecs.has(s.id) && (oe.set(f, 1), he.set(f, 0));
      }
      if (t.elementInputs.val = {
        elasticities: o,
        shearModuli: O,
        areas: e,
        momentsOfInertiaY: n,
        momentsOfInertiaZ: a,
        torsionalConstants: c.torsionFactor !== 1 ? new Map([
          ...r
        ].map(([s, f]) => [
          s,
          f * c.torsionFactor
        ])) : r,
        densities: d,
        poissonsRatios: U,
        thicknesses: H,
        membraneModifiers: oe,
        bendingModifiers: he,
        shellModifiers: ue,
        shellSurfaceLoads: Fe,
        shellAngles: me,
        cargaDeArea: pe,
        cantos: M,
        anchos: F,
        sectionShapes: p,
        localAngles: C,
        shearAreasY: R,
        shearAreasZ: q,
        momentReleases: w,
        endOffsets: X,
        plateFormulations: W,
        deckSections: Z,
        frameLoads: J,
        meshAtIntersections: c.meshCross,
        solidIncompatible: c.solidIncompatible,
        selfWeight: c.selfWeight,
        etabsWallJoint: c.etabsWallJoint,
        areaObjects: c.areaObjs.map((s) => ({
          nodes: s.pts.map((f) => A.get(f)).filter((f) => f !== void 0),
          cells: s.cells.map((f) => _.get(f)).filter((f) => f !== void 0),
          q: s.cells.map((f) => c.shellLoads.get(f)).find((f) => f !== void 0),
          ang: s.cells.map((f) => c.shellAngles.get(f)).find((f) => f !== void 0)
        })).filter((s) => s.nodes.length === 4 && s.cells.length > 0)
      }, c.doSolve && ae.length > 0 && ae.length === k.length) try {
        const s = o.get(ae[0]) ?? 25e6, f = U.get(ae[0]) ?? 0.2;
        ae.some((b) => Math.abs((o.get(b) ?? s) - s) > 1e-9 * s || Math.abs((U.get(b) ?? f) - f) > 1e-12) && c.errors.push("hex: hex8Solve lleva UN material; los solidos tienen E o nu distintos y se usa el del primero");
        const I = /* @__PURE__ */ new Map();
        for (const [b, u] of t.nodeInputs.val.supports ?? []) I.set(b, [
          !!u[0],
          !!u[1],
          !!u[2]
        ]);
        const i = /* @__PURE__ */ new Map();
        for (const [b, u] of Je({
          Dead: B,
          ...Object.fromEntries(K)
        })) i.set(b, [
          u[0] ?? 0,
          u[1] ?? 0,
          u[2] ?? 0
        ]);
        const h = Ye({
          nodes: S,
          elements: k,
          E: s,
          nu: f,
          supports: I,
          loads: i,
          incompatible: c.solidIncompatible
        }), m = /* @__PURE__ */ new Map();
        h.displacements.forEach(([b, u, $], j) => m.set(j, [
          b,
          u,
          $,
          0,
          0,
          0
        ])), t.deformOutputs.val = {
          deformations: m,
          reactions: /* @__PURE__ */ new Map()
        }, t.analyzeOutputs.val = {
          solidStress: h.stressPerElement,
          solidVonMises: h.vonMisesPerElement
        }, console.log(`[CLI Modeler] Solve OK \u2014 ${k.length} solidos H8, ${S.length} nodos (${h.elapsedMs.toFixed(0)} ms)`);
      } catch (s) {
        c.errors.push(`hex8Solve: ${(s == null ? void 0 : s.message) ?? s}`);
      }
      else if (c.doSolve && S.length && k.length) try {
        window.__hekatanCliSprings = te;
        const s = Je({
          Dead: B,
          ...Object.fromEntries(K)
        });
        t.deformOutputs.val = He(S, k, {
          ...t.nodeInputs.val,
          loads: s
        }, t.elementInputs.val, te.length ? te : void 0);
        try {
          t.analyzeOutputs.val = Ze(S, k, t.elementInputs.val, t.deformOutputs.val);
        } catch (f) {
          console.warn("[CLI Modeler] analyze:", (f == null ? void 0 : f.message) ?? f);
        }
        if (c.areaSprings.length > 0) try {
          const f = t.deformOutputs.val.deformations, I = t.analyzeOutputs.val ?? {}, i = I.pressure instanceof Map ? I.pressure : /* @__PURE__ */ new Map();
          let h = 0, m = 0;
          for (const b of c.areaSprings) {
            const u = _.get(b.id);
            if (u === void 0) continue;
            const j = k[u].map((v) => {
              var _a2;
              const y = ((_a2 = f.get(v)) == null ? void 0 : _a2[2]) ?? 0, L = b.ks * y;
              return L < h && (h = L), L > m && (m = L), L;
            });
            i.set(u, j);
          }
          i.size > 0 && (I.pressure = i, I.colorMapRanges = {
            ...I.colorMapRanges ?? {},
            pressure: [
              m,
              h
            ]
          }, t.analyzeOutputs.val = I, console.log(`[CLI Modeler] presi\xF3n Winkler: ${i.size} shells, \u03C3 ${h.toFixed(0)}..${m.toFixed(0)} kN/m\xB2`));
        } catch (f) {
          console.warn("[CLI Modeler] presi\xF3n:", (f == null ? void 0 : f.message) ?? f);
        }
        if (ae.length > 0) try {
          const f = t.deformOutputs.val.deformations, I = /* @__PURE__ */ new Map(), i = /* @__PURE__ */ new Map();
          for (const h of ae) {
            const m = k[h], b = m.map((j) => S[j]), u = m.flatMap((j) => {
              const v = f.get(j) ?? [
                0,
                0,
                0
              ];
              return [
                v[0],
                v[1],
                v[2]
              ];
            }), $ = Ge(b, o.get(h) ?? 25e6, U.get(h) ?? 0.2, u, c.solidIncompatible);
            I.set(h, $.stress), i.set(h, $.vonMises);
          }
          t.analyzeOutputs.val = {
            ...t.analyzeOutputs.val ?? {},
            solidStress: I,
            solidVonMises: i
          };
        } catch (f) {
          console.warn("[CLI Modeler] tensiones de solidos:", (f == null ? void 0 : f.message) ?? f);
        }
        console.log("[CLI Modeler] Solve OK \u2014", k.length, "elementos,", S.length, "nodos");
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
        nodes: S.length,
        frames: c.frames.length,
        shells: c.shells.length,
        supports: se.size,
        loads: B.size,
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
  cs as c,
  Ke as p
};
