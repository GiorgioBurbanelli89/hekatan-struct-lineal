import { i as Ne, t as qe, c as Be, d as _e, a as Pe, b as Ue } from "./cadSections-Cc6U2MoW.js";
import { c as Je } from "./cargasPorCaso-B_GZ_-rO.js";
import { h as Ye, a as Ge, __tla as __tla_0 } from "./h8-Dq5Es-cV.js";
import { a as Ve, __tla as __tla_1 } from "./analyze-Du843e5g.js";
import { m as Ze, d as He, __tla as __tla_2 } from "./didacticCpp-Czy7NlhT.js";
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
    if (c.length > 1 && c.length <= 6 && c.every((S) => S === "0" || S === "1")) return c.forEach((S, _) => {
      T[_] = S === "1";
    }), T;
    for (const S of c) De[S] !== void 0 && (T[De[S]] = true);
    if (/^[01]+$/.test(t) && t.length <= 6) for (let S = 0; S < t.length; S++) T[S] = t[S] === "1";
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
    let T = null, c = 0, S = 0, _ = 0;
    const E = l.split(/\r?\n/);
    for (let P = 0; P < E.length; P++) {
      let L = E[P].trim();
      if (!L || L.startsWith("#") || L.startsWith("//")) continue;
      L = L.replace(/[;]+$/, "");
      const o = L.split(/\s+/), O = o[0].toLowerCase();
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
            !isFinite(e) || !isFinite(n) || !isFinite(a) || !isFinite(r) ? t.errors.push(`L${P + 1}: node mal formado: ${L}`) : t.nodes.set(e, [
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
            const e = parseInt(o[1], 10), n = parseInt(o[2], 10), a = parseInt(o[3], 10), r = parseFloat(o[4] ?? "25e6"), d = parseFloat(o[5] ?? "0.16"), M = parseFloat(o[6] ?? "0.001"), v = o[7] !== void 0 ? parseFloat(o[7]) : void 0, u = o[8] !== void 0 ? parseFloat(o[8]) : void 0, $ = o[9] !== void 0 ? parseFloat(o[9]) : void 0, w = o[10] !== void 0 ? parseFloat(o[10]) : void 0, W = o[11] !== void 0 ? parseFloat(o[11]) : void 0, R = o[12] !== void 0 ? parseFloat(o[12]) : void 0, V = o.indexOf("#"), j = V >= 0 && o[V + 1] ? o[V + 1] : void 0;
            t.frames.push({
              id: e,
              nI: n,
              nJ: a,
              E: r,
              A: d,
              I: M,
              Iy: v,
              J: u,
              nu: $,
              rho: w,
              D: W,
              B: R,
              sec: j
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
            const e = parseInt(o[1], 10), n = o.slice(2, 8).map(($) => parseFloat($)), [a, r, d, M] = n, v = isFinite(n[4]) ? n[4] : r, u = isFinite(n[5]) ? n[5] : d;
            isFinite(e) && a > 0 && r > 0 && d > 0 && M > 0 && v > 0 && u > 0 && d + u < a && M < Math.min(r, v) ? t.frameISec.set(e, {
              d: a,
              bf: r,
              tf: d,
              tw: M,
              t2b: v,
              tfb: u
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
            const e = parseInt(o[1], 10), [n, a, r, d, M] = o.slice(2, 7).map((u) => parseFloat(u)), v = (a - (M || 0)) / 2;
            isFinite(e) && n > 0 && a > 0 && r > 0 && d > 0 && M >= 0 && v > d && r < n ? t.frameDosL.set(e, {
              d: n,
              t2: a,
              tf: r,
              tw: d,
              dis: M
            }) : t.errors.push(`dosl ${o[1]}: hace falta d t2 tf tw dis (m), con (t2 \u2212 dis)/2 > tw`);
            break;
          }
          case "cft": {
            const e = parseInt(o[1], 10), n = o.slice(2).map((R) => parseFloat(R)), a = n.length >= 5 && n[3] < 1 && n[4] >= 1, r = n[0], d = n[1], M = n[2], v = a ? n[3] : n[2], u = a ? 4 : 3, $ = isFinite(n[u]) ? n[u] : 25e6, w = isFinite(n[u + 1]) ? n[u + 1] : 0.2, W = isFinite(n[u + 2]) ? n[u + 2] : 2.4;
            isFinite(e) && r > 0 && d > 0 && M > 0 && v > 0 && v < r / 2 && M < d / 2 && $ > 0 ? t.frameCft.set(e, {
              b: r,
              h: d,
              t: M,
              tw: v,
              Ec: $,
              nuC: w,
              rhoC: W >= 0 ? W : 2.4
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
            const e = o.slice(1).map((w) => parseInt(w, 10));
            if (e.length < 7 || e.some((w) => !isFinite(w))) {
              t.errors.push('areaobj: se esperaba "areaobj ID n1 n2 n3 n4 desdeShell hastaShell"');
              break;
            }
            const [n, a, r, d, M, v, u] = e, $ = [];
            for (let w = v; w <= u; w++) $.push(w);
            t.areaObjs.push({
              id: n,
              pts: [
                a,
                r,
                d,
                M
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
            const e = parseInt(o[1], 10), n = o.slice(2).join(" ");
            t.supports.set(e, je(n));
            break;
          }
          case "load":
          case "l": {
            const e = parseInt(o[1], 10), n = parseFloat(o[2] ?? "0"), a = parseFloat(o[3] ?? "0"), r = parseFloat(o[4] ?? "0"), d = parseFloat(o[5] ?? "0"), M = parseFloat(o[6] ?? "0"), v = parseFloat(o[7] ?? "0"), u = o[8] && isNaN(parseFloat(o[8])) ? o[8] : "Dead";
            /^dead$/i.test(u) ? t.loads.set(e, [
              n,
              a,
              r,
              d,
              M,
              v
            ]) : (t.loadsPat.has(u) || t.loadsPat.set(u, /* @__PURE__ */ new Map()), t.loadsPat.get(u).set(e, [
              n,
              a,
              r,
              d,
              M,
              v
            ]));
            break;
          }
          case "frameload":
          case "fl": {
            const e = parseInt(o[1], 10), n = parseFloat(o[2] ?? "0"), a = parseFloat(o[3] ?? "0"), r = parseFloat(o[4] ?? "0"), d = o[5] && isNaN(parseFloat(o[5])) ? o[5] : "Dead", M = /^dead$/i.test(d) ? t.frameLoads : t.frameLoadsPat.get(d) ?? (t.frameLoadsPat.set(d, /* @__PURE__ */ new Map()), t.frameLoadsPat.get(d)), v = M.get(e) ?? [
              0,
              0,
              0
            ];
            M.set(e, [
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
        t.errors.push(`L${P + 1}: error "${L}" \u2014 ${e.message}`);
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
  ], Z = (l) => Math.hypot(l[0], l[1], l[2]), ie = (l, t) => [
    l[0] * t,
    l[1] * t,
    l[2] * t
  ];
  function We(l, t) {
    const T = l.shellModsDir.get(t);
    return !!T && Math.abs(T[3]) < 1e-12 && Math.abs(T[4]) < 1e-12 && Math.abs(T[5]) < 1e-12;
  }
  function es(l, t = 200, T) {
    const c = [
      0,
      1,
      2
    ].map((u) => (l[0][u] + l[1][u] + l[2][u] + l[3][u]) / 4);
    let S = Y(l[1], l[0]), _ = we(S, Y(l[3], l[0]));
    _ = ie(_, 1 / Z(_)), S = ie(S, 1 / Z(S));
    const E = we(_, S), P = l.map((u) => [
      de(Y(u, c), S),
      de(Y(u, c), E)
    ]);
    let L = [
      0,
      1,
      2,
      3
    ];
    if (T) {
      const u = [
        0,
        1,
        2,
        3
      ].map(($) => {
        const w = Y(l[($ + 1) % 4], l[$]);
        return Math.abs(de(w, T)) / Z(w);
      });
      L = [
        0,
        1,
        2,
        3
      ].sort(($, w) => u[$] - u[w]).slice(0, 2);
    }
    const o = P.map((u) => u[0]), O = P.map((u) => u[1]), e = Math.min(...o), n = Math.max(...o), a = Math.min(...O), r = Math.max(...O), d = [
      0,
      1,
      2,
      3
    ].map(() => ({
      pts: [],
      dA: 0
    }));
    let M = 0;
    for (let u = 0; u < t; u++) for (let $ = 0; $ < t; $++) {
      const w = e + (n - e) * (u + 0.5) / t, W = a + (r - a) * ($ + 0.5) / t;
      let R = 0, V = 0;
      for (let B = 0; B < 4; B++) {
        const U = P[B], H = P[(B + 1) % 4];
        (H[0] - U[0]) * (W - U[1]) - (H[1] - U[1]) * (w - U[0]) >= 0 ? R++ : V++;
      }
      if (R !== 4 && V !== 4) continue;
      let j = L[0], X = 1 / 0;
      for (const B of L) {
        const U = P[B], H = P[(B + 1) % 4], te = H[0] - U[0], q = H[1] - U[1], fe = te * te + q * q, re = Math.max(0, Math.min(1, ((w - U[0]) * te + (W - U[1]) * q) / fe)), K = Math.hypot(w - (U[0] + re * te), W - (U[1] + re * q));
        K < X && (X = K, j = B);
      }
      d[j].pts.push([
        c[0] + w * S[0] + W * E[0],
        c[1] + w * S[1] + W * E[1],
        c[2] + w * S[2] + W * E[2]
      ]), M++;
    }
    const v = 0.5 * Z(we(Y(l[2], l[0]), Y(l[3], l[1])));
    for (const u of d) u.dA = M ? v / M : 0;
    return d;
  }
  function ss(l, t) {
    if (!(t > 0)) return;
    const T = 1e-6, c = (O) => l.nodes.get(O);
    let S = Math.max(0, ...l.nodes.keys()) + 1, _ = l.shells.reduce((O, e) => Math.max(O, e.id), 0) + 1;
    const E = (O) => {
      for (const [n, a] of l.nodes) if (Z(Y(a, O)) < T) return n;
      const e = S++;
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
    }, L = [];
    let o = 0;
    for (const O of l.shells) {
      if (O.pts.length !== 4) {
        L.push(O);
        continue;
      }
      const e = O.pts.map(c);
      if (e.some((u) => !u)) {
        L.push(O);
        continue;
      }
      const n = (Z(Y(e[1], e[0])) + Z(Y(e[2], e[3]))) / 2, a = (Z(Y(e[3], e[0])) + Z(Y(e[2], e[1]))) / 2, r = Math.max(1, Math.ceil(n / t - 1e-9)), d = Math.max(1, Math.ceil(a / t - 1e-9));
      if (r === 1 && d === 1) {
        L.push(O);
        continue;
      }
      const M = (u, $) => [
        0,
        1,
        2
      ].map((w) => e[0][w] * (1 - u) * (1 - $) + e[1][w] * u * (1 - $) + e[2][w] * u * $ + e[3][w] * (1 - u) * $), v = [];
      for (let u = 0; u <= r; u++) {
        const $ = [];
        for (let w = 0; w <= d; w++) $.push(E(M(u / r, w / d)));
        v.push($);
      }
      for (let u = 0; u < r; u++) for (let $ = 0; $ < d; $++) {
        const w = u === 0 && $ === 0 ? O.id : _++;
        L.push({
          ...O,
          id: w,
          pts: [
            v[u][$],
            v[u + 1][$],
            v[u + 1][$ + 1],
            v[u][$ + 1]
          ]
        }), w !== O.id && P(O.id, w);
      }
      o++;
    }
    o && (l.shells = L, console.log(`[CLI Modeler] automesh ${t} m: ${o} pano(s) partido(s) -> ${l.shells.length} cascaras, ${l.nodes.size} nudos`));
  }
  function ts(l) {
    const T = (a) => l.nodes.get(a), c = [
      ...l.nodes.keys()
    ], S = (a, r, d) => {
      const M = Y(r, a), v = Z(M), u = ie(M, 1 / v), $ = [];
      for (const w of c) {
        if (d.includes(w)) continue;
        const W = Y(T(w), a), R = de(W, u);
        R > 1e-6 && R < v - 1e-6 && Z(Y(W, ie(u, R))) < 1e-4 && $.push(R / v);
      }
      return $.sort((w, W) => w - W);
    }, _ = (a, r) => {
      const d = [];
      for (const M of a) r.some((v) => Math.abs(M - v) < 1e-5) && !d.some((v) => Math.abs(M - v) < 1e-5) && d.push(M);
      return d;
    }, E = (a) => {
      for (const r of c) if (Z(Y(T(r), a)) < 1e-4) return r;
    };
    let P = l.shells.reduce((a, r) => Math.max(a, r.id), 0) + 1;
    const L = [], o = (a, r) => {
      const d = l.shellModsDir.get(a);
      d && l.shellModsDir.set(r, [
        ...d
      ]);
      const M = l.shellMods.get(a);
      M && l.shellMods.set(r, [
        ...M
      ]);
      const v = l.shellLoads.get(a);
      v !== void 0 && l.shellLoads.set(r, v);
      const u = l.shellTypes.get(a);
      u !== void 0 && l.shellTypes.set(r, u);
      const $ = l.shellAngles.get(a);
      $ !== void 0 && l.shellAngles.set(r, $);
    };
    for (const a of l.shells) {
      if (!We(l, a.id) || a.pts.length !== 4 || a.pts.some((j) => !l.nodes.has(j))) {
        L.push(a);
        continue;
      }
      const r = a.pts.map(T), d = S(r[0], r[1], a.pts), M = S(r[2], r[3], a.pts).map((j) => 1 - j), v = S(r[1], r[2], a.pts), u = S(r[3], r[0], a.pts).map((j) => 1 - j);
      let $ = [
        0,
        ..._(d, M),
        1
      ], w = [
        0,
        ..._(v, u),
        1
      ];
      if ($.length === 2 && w.length === 2) {
        L.push(a);
        continue;
      }
      const W = (j, X) => [
        0,
        1,
        2
      ].map((B) => (1 - j) * (1 - X) * r[0][B] + j * (1 - X) * r[1][B] + j * X * r[2][B] + (1 - j) * X * r[3][B]);
      let R = w.map((j) => $.map((X) => E(W(X, j))));
      if (R.some((j) => j.some((X) => X === void 0)) && ($.length >= w.length ? w = [
        0,
        1
      ] : $ = [
        0,
        1
      ], R = w.map((j) => $.map((X) => E(W(X, j)))), R.some((j) => j.some((X) => X === void 0)))) {
        L.push(a);
        continue;
      }
      let V = true;
      for (let j = 0; j < w.length - 1; j++) for (let X = 0; X < $.length - 1; X++) {
        const B = [
          R[j][X],
          R[j][X + 1],
          R[j + 1][X + 1],
          R[j + 1][X]
        ], U = V ? a.id : P++;
        V || o(a.id, U), V = false, L.push({
          id: U,
          pts: B,
          t: a.t,
          E: a.E,
          rho: a.rho
        });
      }
    }
    l.shells = L;
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
      const d = Y(r, a), M = Z(d), v = ie(d, 1 / M);
      return l.frames.filter((u) => [
        u.nI,
        u.nJ
      ].every(($) => {
        const w = l.nodes.get($);
        if (!w) return false;
        const W = Y(w, a), R = de(W, v);
        return R > -1e-4 && R < M + 1e-4 && Z(Y(W, ie(v, R))) < 1e-4;
      }));
    };
    for (const a of l.shells) {
      if (!We(l, a.id) || a.pts.length !== 4) continue;
      const r = l.selfWeight ? (a.rho ?? 2.45) * a.t * O * l.selfWeight : 0, d = l.shellLoads.get(a.id) ?? 0, M = -r + d;
      if (Math.abs(M) < 1e-15) continue;
      const v = a.pts.map(T);
      let u;
      if (l.deckOneWay) {
        const w = Y(v[1], v[0]);
        let W = we(w, Y(v[3], v[0]));
        W = ie(W, 1 / Z(W));
        const R = ie(w, 1 / Z(w)), V = we(W, R), j = (l.shellAngles.get(a.id) ?? 0) * Math.PI / 180;
        u = [
          0,
          1,
          2
        ].map((X) => Math.cos(j) * R[X] + Math.sin(j) * V[X]);
      }
      const $ = es(v, 200, u);
      for (let w = 0; w < 4; w++) {
        const { pts: W, dA: R } = $[w];
        if (!W.length) continue;
        const V = v[w], j = v[(w + 1) % 4], X = n(V, j);
        if (!X.length) {
          const q = M * R * W.length;
          e(a.pts[w], [
            0,
            0,
            q / 2,
            0,
            0,
            0
          ]), e(a.pts[(w + 1) % 4], [
            0,
            0,
            q / 2,
            0,
            0,
            0
          ]);
          continue;
        }
        const B = Y(j, V), U = Z(B), H = ie(B, 1 / U), te = W.map((q) => de(Y(q, V), H));
        for (const q of X) {
          const fe = T(q.nI), re = T(q.nJ), K = de(Y(fe, V), H), Me = de(Y(re, V), H), pe = Math.min(K, Me), Q = Math.max(K, Me), ce = Q - pe;
          if (ce < 1e-9) continue;
          const ee = Q >= U - 1e-6, ae = ie(Y(re, fe), 1 / ce), oe = we(ae, [
            0,
            0,
            1
          ]);
          let he = 0, ue = 0, Fe = 0, me = 0;
          for (const ge of te) {
            if (ge < pe - 1e-9 || (ee ? ge > Q + 1e-9 : ge >= Q - 1e-9)) continue;
            let le = ge - pe;
            K > Me && (le = ce - le);
            const s = le / ce;
            he += 1 - 3 * s * s + 2 * s * s * s, ue += ce * (s - 2 * s * s + s * s * s), Fe += 3 * s * s - 2 * s * s * s, me += ce * (-s * s + s * s * s);
          }
          const se = M * R;
          e(q.nI, [
            0,
            0,
            se * he,
            oe[0] * se * ue,
            oe[1] * se * ue,
            oe[2] * se * ue
          ]), e(q.nJ, [
            0,
            0,
            se * Fe,
            oe[0] * se * me,
            oe[1] * se * me,
            oe[2] * se * me
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
      const c = t.nodes.val, S = t.elements.val;
      if (!(!c.length || !S.length)) try {
        const _ = Math.max(1, parseInt(window.__hekatanCliModalModes ?? "12", 10) || 12), E = t.nodeInputs.val, P = window.__hekatanCliSprings, L = Ze(c, S, E, t.elementInputs.val, _, 0, 0, 1, (E == null ? void 0 : E.diaphragms) instanceof Map && E.diaphragms.size ? E.diaphragms : void 0, P && P.length ? P : void 0);
        console.log(`[CLI Modeler] Modal OK \u2014 ${L.frequencies.length} modos, T1 = ${L.frequencies[0] ? (1 / L.frequencies[0]).toFixed(5) : "\u2014"} s`), (_a = T == null ? void 0 : T.render) == null ? void 0 : _a.call(T, L, {
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
      const S = /* @__PURE__ */ new Map(), _ = /* @__PURE__ */ new Map(), E = [], P = Array.from(c.nodes.keys()).sort((s, h) => s - h);
      for (const s of P) S.set(s, E.length), E.push(c.nodes.get(s));
      const L = [], o = /* @__PURE__ */ new Map(), O = /* @__PURE__ */ new Map(), e = /* @__PURE__ */ new Map(), n = /* @__PURE__ */ new Map(), a = /* @__PURE__ */ new Map(), r = /* @__PURE__ */ new Map(), d = /* @__PURE__ */ new Map(), M = /* @__PURE__ */ new Map(), v = /* @__PURE__ */ new Map(), u = /* @__PURE__ */ new Map(), $ = /* @__PURE__ */ new Map(), w = /* @__PURE__ */ new Map(), W = /* @__PURE__ */ new Map(), R = /* @__PURE__ */ new Map(), V = /* @__PURE__ */ new Map(), j = /* @__PURE__ */ new Map(), X = /* @__PURE__ */ new Map(), B = /* @__PURE__ */ new Map(), U = /* @__PURE__ */ new Map(), H = /* @__PURE__ */ new Map();
      for (const s of c.frames) {
        const h = S.get(s.nI), k = S.get(s.nJ);
        if (h === void 0 || k === void 0) {
          const g = P.length ? `IDs disponibles: ${P.join(", ")}` : "ning\xFAn nodo definido", z = [];
          h === void 0 && z.push(s.nI), k === void 0 && z.push(s.nJ), c.errors.push(`frame ${s.id}: nodo(s) inexistente(s) [${z.join(", ")}] \u2014 ${g}`);
          continue;
        }
        const i = L.length;
        L.push([
          h,
          k
        ]);
        const f = s.nu ?? 0.2;
        o.set(i, s.E), O.set(i, s.E / (2 * (1 + f))), e.set(i, s.A), n.set(i, s.I), a.set(i, s.Iy ?? s.I), r.set(i, s.J ?? 0.14 * Math.pow(Math.sqrt(s.A), 4)), d.set(i, s.rho ?? 2.45), U.set(i, f), s.D !== void 0 && isFinite(s.D) && M.set(i, s.D), s.B !== void 0 && isFinite(s.B) && v.set(i, s.B);
        const m = c.frameAngles.get(s.id);
        m !== void 0 && isFinite(m) && $.set(i, m);
        const b = c.frameReleases.get(s.id);
        b && w.set(i, b);
        const p = c.frameEndOffsets.get(s.id);
        p && W.set(i, p);
        const C = c.frameLoads.get(s.id);
        C && j.set(i, C);
        const J = c.frameShearAreas.get(s.id);
        if (J && (B.set(i, J[0]), X.set(i, J[1])), s.sec || s.D !== void 0 && s.B !== void 0) {
          const g = {
            type: "general"
          };
          s.sec && (g.name = s.sec), s.D !== void 0 && isFinite(s.D) && (g.h = s.D), s.B !== void 0 && isFinite(s.B) && (g.b = s.B), u.set(i, g);
        }
        const I = c.frameISec.get(s.id);
        if (I) {
          const g = Ne(I.d, I.bf, I.tf, I.tw, I.t2b, I.tfb);
          e.set(i, g.A), a.set(i, g.Iz), n.set(i, g.Iy), r.set(i, g.J), B.set(i, g.As2), X.set(i, g.As3), M.set(i, I.d), v.set(i, Math.max(I.bf, I.t2b));
          const z = (N) => Math.round(N * 1e4) / 10;
          u.set(i, {
            type: "I",
            h: I.d,
            b: I.bf,
            tf: I.tf,
            tw: I.tw,
            t2b: I.t2b,
            tfb: I.tfb,
            name: s.sec ?? `I${z(I.d)}X${z(I.bf)}X${z(I.tf)}X${z(I.tw)}`
          });
        }
        const x = c.frameTube.get(s.id);
        if (x) {
          const g = qe(x.b, x.h, x.tf, x.tw);
          e.set(i, g.A), a.set(i, g.Iz), n.set(i, g.Iy), r.set(i, g.J), B.set(i, g.As2), X.set(i, g.As3), M.set(i, x.h), v.set(i, x.b);
          const z = (N) => Math.round(N * 1e4) / 10;
          u.set(i, {
            type: "HSS",
            h: x.h,
            b: x.b,
            tf: x.tf,
            tw: x.tw,
            name: s.sec ?? `TUBO${z(x.h)}X${z(x.b)}X${z(x.tf)}X${z(x.tw)}`
          });
        }
        const y = c.frameCanal.get(s.id);
        if (y) {
          const g = Be(y.d, y.bf, y.tf, y.tw);
          e.set(i, g.A), a.set(i, g.Iz), n.set(i, g.Iy), r.set(i, g.J), B.set(i, g.As2), X.set(i, g.As3), M.set(i, y.d), v.set(i, y.bf);
          const z = (N) => Math.round(N * 1e4) / 10;
          u.set(i, {
            type: "C",
            h: y.d,
            b: y.bf,
            tf: y.tf,
            tw: y.tw,
            name: s.sec ?? `C${z(y.d)}X${z(y.bf)}X${z(y.tf)}X${z(y.tw)}`
          });
        }
        const A = c.frameDosL.get(s.id);
        if (A) {
          const g = _e(A.d, A.t2, A.tf, A.tw, A.dis);
          e.set(i, g.A), a.set(i, g.Iz), n.set(i, g.Iy), r.set(i, g.J), B.set(i, g.As2), X.set(i, g.As3), M.set(i, A.d), v.set(i, A.t2);
          const z = (N) => Math.round(N * 1e4) / 10;
          u.set(i, {
            type: "2L",
            h: A.d,
            b: A.t2,
            tf: A.tf,
            tw: A.tw,
            dis: A.dis,
            name: s.sec ?? `2L${z(A.d)}X${z(A.t2)}X${z(A.tf)}X${z(A.tw)}S${z(A.dis)}`
          });
        }
        const F = c.frameCftc.get(s.id);
        if (F) {
          const g = Pe(F.D, F.t, s.E, f, F.Ec, F.nuC);
          e.set(i, g.A), a.set(i, g.Iz), n.set(i, g.Iy), r.set(i, g.J), B.set(i, g.As2), X.set(i, g.As3), M.set(i, F.D), v.set(i, F.D);
          const z = F.D - 2 * F.t, N = Math.PI * z * z / 4, G = Math.PI * F.D * F.D / 4 - N;
          d.set(i, ((s.rho ?? 7.85) * G + F.rhoC * N) / g.A), u.set(i, {
            type: "CFT",
            d: F.D,
            tw: F.t,
            fillE: F.Ec,
            fillRho: F.rhoC,
            steelRho: s.rho ?? 7.85,
            name: s.sec ?? `CFTC ${Math.round(F.D * 1e3)}X${Math.round(F.t * 1e3)}`
          });
        }
        const D = c.frameCft.get(s.id);
        if (D) {
          const g = Ue(D.b, D.h, D.t, s.E, f, D.Ec, D.nuC, D.tw);
          e.set(i, g.A), a.set(i, g.Iz), n.set(i, g.Iy), r.set(i, g.J), B.set(i, g.As2), X.set(i, g.As3), M.set(i, D.h), v.set(i, D.b);
          const z = (D.b - 2 * D.tw) * (D.h - 2 * D.t), N = D.b * D.h - z;
          d.set(i, ((s.rho ?? 7.85) * N + D.rhoC * z) / g.A);
          const G = (ne) => Math.round(ne * 1e3);
          u.set(i, {
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
        const s = (b, p) => b[0] * p[0] + b[1] * p[1] + b[2] * p[2], h = [
          o,
          O,
          e,
          n,
          a,
          r,
          d,
          U,
          M,
          v,
          $,
          X,
          B,
          u,
          j
        ], k = (b, p) => {
          for (const C of h) C.has(b) && C.set(p, C.get(b));
        }, i = (b) => {
          for (let p = 0; p < E.length; p++) if (Math.hypot(E[p][0] - b[0], E[p][1] - b[1], E[p][2] - b[2]) < 1e-6) return p;
          return E.push([
            b[0],
            b[1],
            b[2]
          ]), E.length - 1;
        }, f = (b) => {
          const p = E[b[0]], C = E[b[1]];
          return [
            Math.min(p[0], C[0]),
            Math.min(p[1], C[1]),
            Math.min(p[2], C[2]),
            Math.max(p[0], C[0]),
            Math.max(p[1], C[1]),
            Math.max(p[2], C[2])
          ];
        };
        let m = 0;
        for (let b = 0; b < L.length; b++) {
          if (L[b].length !== 2) continue;
          const p = f(L[b]);
          for (let C = b + 1; C < L.length; C++) {
            if (L[C].length !== 2) continue;
            const [J, I] = L[b], [x, y] = L[C];
            if (J === x || J === y || I === x || I === y) continue;
            const A = f(L[C]);
            if (p[0] > A[3] + 1e-6 || A[0] > p[3] + 1e-6 || p[1] > A[4] + 1e-6 || A[1] > p[4] + 1e-6 || p[2] > A[5] + 1e-6 || A[2] > p[5] + 1e-6) continue;
            const F = E[J], D = E[I], g = E[x], z = E[y], N = [
              D[0] - F[0],
              D[1] - F[1],
              D[2] - F[2]
            ], G = [
              z[0] - g[0],
              z[1] - g[1],
              z[2] - g[2]
            ], ne = [
              F[0] - g[0],
              F[1] - g[1],
              F[2] - g[2]
            ], Le = s(N, N), xe = s(N, G), Ce = s(G, G), ze = s(N, ne), Oe = s(G, ne), $e = Le * Ce - xe * xe;
            if ($e < 1e-10 * Le * Ce) continue;
            const Ie = (xe * Oe - Ce * ze) / $e, ve = (Le * Oe - xe * ze) / $e;
            if (Ie < 1e-6 || Ie > 1 - 1e-6 || ve < 1e-6 || ve > 1 - 1e-6) continue;
            const ye = [
              F[0] + Ie * N[0],
              F[1] + Ie * N[1],
              F[2] + Ie * N[2]
            ], Ae = [
              g[0] + ve * G[0],
              g[1] + ve * G[1],
              g[2] + ve * G[2]
            ];
            if (Math.hypot(ye[0] - Ae[0], ye[1] - Ae[1], ye[2] - Ae[2]) > 1e-6) continue;
            const Te = i(ye);
            for (const be of [
              b,
              C
            ]) {
              const [Xe, Re] = L[be], Se = L.length;
              L[be] = [
                Xe,
                Te
              ], L.push([
                Te,
                Re
              ]), k(be, Se);
              const Ee = w.get(be);
              Ee && (w.set(be, [
                ...Ee.slice(0, 6),
                ...Array(6).fill(false)
              ]), w.set(Se, [
                ...Array(6).fill(false),
                ...Ee.slice(6)
              ]));
              const ke = W.get(be);
              ke && (W.set(be, [
                ke[0],
                0,
                ke[2]
              ]), W.set(Se, [
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
        const h = s.pts.map((m) => S.get(m));
        if (h.some((m) => m === void 0)) {
          c.errors.push(`shell ${s.id}: algun nodo inexistente`);
          continue;
        }
        const k = L.length;
        _.set(s.id, k), L.push(h), o.set(k, s.E), O.set(k, s.E / (2 * 1.2)), H.set(k, s.t), d.set(k, s.rho ?? 2.45), U.set(k, 0.2);
        const i = c.shellTypes.get(s.id);
        i !== void 0 && R.set(k, i);
        const f = c.deckSecs.get(s.id);
        if (f) {
          const m = f.tc + (f.sr > 0 ? f.hr * (f.wrt + f.wrb) / 2 / f.sr : 0);
          H.set(k, f.tc), d.set(k, ((s.rho ?? 2.45) * m + f.w / 9.80665) / f.tc), V.set(k, {
            ...f
          });
        }
      }
      const te = /* @__PURE__ */ new Map();
      for (const [s, h] of c.supports.entries()) {
        const k = S.get(s);
        k !== void 0 && te.set(k, h);
      }
      const q = /* @__PURE__ */ new Map();
      for (const [s, h] of c.loads.entries()) {
        const k = S.get(s);
        k !== void 0 && q.set(k, [
          ...h
        ]);
      }
      const fe = /* @__PURE__ */ new Map();
      for (const [s, h] of c.diaphragms.entries()) {
        const k = S.get(s);
        k !== void 0 && fe.set(k, h);
      }
      const re = /* @__PURE__ */ new Map();
      for (const [s, h] of c.masses.entries()) {
        const k = S.get(s);
        k !== void 0 && re.set(k, h);
      }
      const K = /* @__PURE__ */ new Map();
      for (const [s, h] of c.loadsPat) {
        const k = /* @__PURE__ */ new Map();
        for (const [i, f] of h) {
          const m = S.get(i);
          m !== void 0 && k.set(m, [
            ...f
          ]);
        }
        K.set(s, k);
      }
      const Me = [
        [
          c.frameLoads,
          q
        ]
      ];
      for (const [s, h] of c.frameLoadsPat) K.has(s) || K.set(s, /* @__PURE__ */ new Map()), Me.push([
        h,
        K.get(s)
      ]);
      for (const [s, h] of Me) if (s.size) {
        const k = (i, f) => {
          const m = h.get(i) ?? [
            0,
            0,
            0,
            0,
            0,
            0
          ];
          h.set(i, [
            m[0] + f[0],
            m[1] + f[1],
            m[2] + f[2],
            m[3] + f[3],
            m[4] + f[4],
            m[5] + f[5]
          ]);
        };
        for (const [i, f] of s.entries()) {
          const m = c.frames.find((D) => D.id === i);
          if (!m) {
            c.errors.push(`frameload ${i}: no existe esa barra`);
            continue;
          }
          const b = S.get(m.nI), p = S.get(m.nJ);
          if (b === void 0 || p === void 0) continue;
          const C = E[b], J = E[p], I = [
            J[0] - C[0],
            J[1] - C[1],
            J[2] - C[2]
          ], x = Math.hypot(I[0], I[1], I[2]);
          if (x < 1e-9) continue;
          const y = [
            I[0] / x,
            I[1] / x,
            I[2] / x
          ], A = x * x / 12, F = [
            y[1] * f[2] - y[2] * f[1],
            y[2] * f[0] - y[0] * f[2],
            y[0] * f[1] - y[1] * f[0]
          ];
          k(b, [
            f[0] * x / 2,
            f[1] * x / 2,
            f[2] * x / 2,
            A * F[0],
            A * F[1],
            A * F[2]
          ]), k(p, [
            f[0] * x / 2,
            f[1] * x / 2,
            f[2] * x / 2,
            -A * F[0],
            -A * F[1],
            -A * F[2]
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
        const h = c.shellLoads.get(s.id);
        if (!h || c.deckTributario.has(s.id)) continue;
        const k = s.pts.map((m) => S.get(m));
        if (k.some((m) => m === void 0)) {
          c.errors.push(`areaload ${s.id}: algun nodo inexistente`);
          continue;
        }
        const i = k.map((m) => E[m]), f = [
          0,
          0,
          0,
          0
        ];
        for (const [m, b] of ce) {
          const p = [
            0.25 * (1 - m) * (1 - b),
            0.25 * (1 + m) * (1 - b),
            0.25 * (1 + m) * (1 + b),
            0.25 * (1 - m) * (1 + b)
          ], C = [
            -0.25 * (1 - b),
            0.25 * (1 - b),
            0.25 * (1 + b),
            -0.25 * (1 + b)
          ], J = [
            -0.25 * (1 - m),
            -0.25 * (1 + m),
            0.25 * (1 + m),
            0.25 * (1 - m)
          ], I = [
            0,
            1,
            2
          ].map((F) => C.reduce((D, g, z) => D + g * i[z][F], 0)), x = [
            0,
            1,
            2
          ].map((F) => J.reduce((D, g, z) => D + g * i[z][F], 0)), y = [
            I[1] * x[2] - I[2] * x[1],
            I[2] * x[0] - I[0] * x[2],
            I[0] * x[1] - I[1] * x[0]
          ], A = Math.hypot(y[0], y[1], y[2]);
          for (let F = 0; F < 4; F++) f[F] += p[F] * h * A;
        }
        for (let m = 0; m < 4; m++) {
          const b = k[m], p = q.get(b) ?? [
            0,
            0,
            0,
            0,
            0,
            0
          ];
          p[2] += f[m], q.set(b, p), pe.set(b, (pe.get(b) ?? 0) + f[m]);
        }
      }
      if (c.selfWeight) {
        const h = /* @__PURE__ */ new Set();
        for (const [i, f] of _) c.deckTributario.has(i) && h.add(f);
        const k = (i, f) => {
          const m = q.get(i) ?? [
            0,
            0,
            0,
            0,
            0,
            0
          ];
          m[2] += f, q.set(i, m);
        };
        L.forEach((i, f) => {
          const m = d.get(f) ?? 0;
          if (m && !h.has(f)) {
            if (i.length === 2) {
              const b = e.get(f) ?? 0, p = E[i[0]], C = E[i[1]], J = [
                C[0] - p[0],
                C[1] - p[1],
                C[2] - p[2]
              ];
              let I = Math.hypot(J[0], J[1], J[2]);
              const x = W.get(f);
              if (x) {
                const N = Math.hypot(J[0], J[1]);
                N > 1e-9 && Math.abs(Math.atan2(Math.abs(J[2]), N)) * 180 / Math.PI < 20 && (I = Math.max(I - x[0] - x[1], 0));
              }
              const y = Math.hypot(J[0], J[1], J[2]), A = -b * m * 9.80665 * c.selfWeight, F = [
                J[0] / y,
                J[1] / y,
                J[2] / y
              ], D = I * I / 12, g = [
                F[1] * A,
                -F[0] * A,
                0
              ], z = (N, G) => {
                const ne = q.get(N) ?? [
                  0,
                  0,
                  0,
                  0,
                  0,
                  0
                ];
                q.set(N, [
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
                A * I / 2,
                D * g[0],
                D * g[1],
                0
              ]), z(i[1], [
                0,
                0,
                A * I / 2,
                -D * g[0],
                -D * g[1],
                0
              ]);
            } else if (i.length === 4) {
              const b = H.get(f) ?? 0, p = i.map((I) => E[I]);
              let C = 0;
              for (let I = 1; I < 3; I++) {
                const x = [
                  p[I][0] - p[0][0],
                  p[I][1] - p[0][1],
                  p[I][2] - p[0][2]
                ], y = [
                  p[I + 1][0] - p[0][0],
                  p[I + 1][1] - p[0][1],
                  p[I + 1][2] - p[0][2]
                ], A = [
                  x[1] * y[2] - x[2] * y[1],
                  x[2] * y[0] - x[0] * y[2],
                  x[0] * y[1] - x[1] * y[0]
                ];
                C += Math.hypot(A[0], A[1], A[2]) / 2;
              }
              const J = C * b * m * 9.80665 * c.selfWeight;
              for (const I of i) k(I, -J / 4);
            }
          }
        });
      }
      const ee = [];
      for (const s of c.springs) {
        const h = S.get(s.node);
        h !== void 0 && ee.push({
          node: h,
          dof: s.dof,
          k: s.k
        });
      }
      for (const s of c.areaSprings) {
        const h = _.get(s.id);
        if (h === void 0) {
          c.errors.push(`areaspring ${s.id}: no existe esa cascara`);
          continue;
        }
        ee.push({
          node: -(h + 1),
          dof: s.nodal ? -3 : -1,
          k: s.ks
        });
      }
      if (c.edgeEtabs) {
        const s = /* @__PURE__ */ new Set(), h = [];
        L.forEach((i, f) => {
          if (i.length === 3 || i.length === 4) {
            h.push(f);
            for (const m of i) s.add(m);
          }
        });
        let k = 0;
        for (const i of h) {
          const f = L[i], m = f.map((p) => E[p]), b = [
            0,
            1,
            2
          ].map((p) => [
            Math.min(...m.map((C) => C[p])),
            Math.max(...m.map((C) => C[p]))
          ]);
          for (let p = 0; p < E.length; p++) {
            if (f.includes(p)) continue;
            const C = E[p];
            if (C[0] < b[0][0] - 1e-6 || C[0] > b[0][1] + 1e-6 || C[1] < b[1][0] - 1e-6 || C[1] > b[1][1] + 1e-6 || C[2] < b[2][0] - 1e-6 || C[2] > b[2][1] + 1e-6) continue;
            let J = false;
            for (let x = 0; x < f.length && !J; x++) {
              const y = m[x], A = m[(x + 1) % f.length], F = [
                A[0] - y[0],
                A[1] - y[1],
                A[2] - y[2]
              ], D = F[0] * F[0] + F[1] * F[1] + F[2] * F[2];
              if (D < 1e-24) continue;
              const g = [
                C[0] - y[0],
                C[1] - y[1],
                C[2] - y[2]
              ], z = (g[0] * F[0] + g[1] * F[1] + g[2] * F[2]) / D;
              if (z <= 1e-6 || z >= 1 - 1e-6) continue;
              const N = [
                g[0] - z * F[0],
                g[1] - z * F[1],
                g[2] - z * F[2]
              ];
              Math.hypot(N[0], N[1], N[2]) <= 1e-6 * Math.sqrt(D) && (J = true);
            }
            !J || !L.some((x, y) => y !== i && x.includes(p)) || (ee.push({
              node: -(i + 1),
              dof: -2,
              k: p
            }), k++);
          }
        }
        k && console.log(`[CLI Modeler] edge etabs: ${k} nudo(s) colgado(s) atado(s) a su arista (Hermite)`);
      }
      const ae = [];
      for (const s of c.solids) {
        const h = s.pts.map((i) => S.get(i));
        if (h.some((i) => i === void 0)) {
          c.errors.push(`hex ${s.id}: algun nodo inexistente`);
          continue;
        }
        const k = L.length;
        if (L.push(h), o.set(k, s.E), U.set(k, s.nu), O.set(k, s.E / (2 * (1 + s.nu))), d.set(k, s.rho), ae.push(k), c.selfWeight && s.rho) {
          const i = h.map((p) => E[p]), f = (p, C, J, I) => {
            const x = [
              0,
              1,
              2
            ].map((F) => i[C][F] - i[p][F]), y = [
              0,
              1,
              2
            ].map((F) => i[J][F] - i[p][F]), A = [
              0,
              1,
              2
            ].map((F) => i[I][F] - i[p][F]);
            return Math.abs(x[0] * (y[1] * A[2] - y[2] * A[1]) - x[1] * (y[0] * A[2] - y[2] * A[0]) + x[2] * (y[0] * A[1] - y[1] * A[0])) / 6;
          }, b = (f(0, 1, 2, 6) + f(0, 2, 3, 6) + f(0, 3, 7, 6) + f(0, 7, 4, 6) + f(0, 4, 5, 6) + f(0, 5, 1, 6)) * s.rho * 9.80665 * c.selfWeight;
          for (const p of h) {
            const C = q.get(p) ?? [
              0,
              0,
              0,
              0,
              0,
              0
            ];
            C[2] -= b / 8, q.set(p, C);
          }
        }
      }
      t.nodes.val = E, t.elements.val = L, t.nodeInputs.val = {
        supports: te,
        loads: q,
        masses: re,
        diaphragms: fe,
        springs: ee
      }, t.springs && (t.springs.val = ee);
      const oe = /* @__PURE__ */ new Map(), he = /* @__PURE__ */ new Map(), ue = /* @__PURE__ */ new Map(), Fe = /* @__PURE__ */ new Map(), me = /* @__PURE__ */ new Map();
      for (const s of c.shells) {
        const h = _.get(s.id);
        if (h === void 0) continue;
        const k = c.shellLoads.get(s.id);
        k !== void 0 && Fe.set(h, k);
        const i = c.shellAngles.get(s.id);
        i !== void 0 && me.set(h, i);
        const f = c.shellModsDir.get(s.id);
        if (f) {
          ue.set(h, f), oe.set(h, (f[0] + f[1]) / 2), he.set(h, (f[3] + f[4]) / 2);
          continue;
        }
        const m = c.shellMods.get(s.id);
        m ? (oe.set(h, m[0]), he.set(h, m[1])) : c.deckSecs.has(s.id) && (oe.set(h, 1), he.set(h, 0));
      }
      if (t.elementInputs.val = {
        elasticities: o,
        shearModuli: O,
        areas: e,
        momentsOfInertiaY: n,
        momentsOfInertiaZ: a,
        torsionalConstants: c.torsionFactor !== 1 ? new Map([
          ...r
        ].map(([s, h]) => [
          s,
          h * c.torsionFactor
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
        anchos: v,
        sectionShapes: u,
        localAngles: $,
        shearAreasY: X,
        shearAreasZ: B,
        momentReleases: w,
        endOffsets: W,
        plateFormulations: R,
        deckSections: V,
        frameLoads: j,
        meshAtIntersections: c.meshCross,
        solidIncompatible: c.solidIncompatible,
        selfWeight: c.selfWeight,
        etabsWallJoint: c.etabsWallJoint,
        areaObjects: c.areaObjs.map((s) => ({
          nodes: s.pts.map((h) => S.get(h)).filter((h) => h !== void 0),
          cells: s.cells.map((h) => _.get(h)).filter((h) => h !== void 0),
          q: s.cells.map((h) => c.shellLoads.get(h)).find((h) => h !== void 0),
          ang: s.cells.map((h) => c.shellAngles.get(h)).find((h) => h !== void 0)
        })).filter((s) => s.nodes.length === 4 && s.cells.length > 0)
      }, c.doSolve && ae.length > 0 && ae.length === L.length && ee.length === 0) try {
        const s = o.get(ae[0]) ?? 25e6, h = U.get(ae[0]) ?? 0.2;
        ae.some((b) => Math.abs((o.get(b) ?? s) - s) > 1e-9 * s || Math.abs((U.get(b) ?? h) - h) > 1e-12) && c.errors.push("hex: hex8Solve lleva UN material; los solidos tienen E o nu distintos y se usa el del primero");
        const k = /* @__PURE__ */ new Map();
        for (const [b, p] of t.nodeInputs.val.supports ?? []) k.set(b, [
          !!p[0],
          !!p[1],
          !!p[2]
        ]);
        const i = /* @__PURE__ */ new Map();
        for (const [b, p] of Je({
          Dead: q,
          ...Object.fromEntries(K)
        })) i.set(b, [
          p[0] ?? 0,
          p[1] ?? 0,
          p[2] ?? 0
        ]);
        const f = Ye({
          nodes: E,
          elements: L,
          E: s,
          nu: h,
          supports: k,
          loads: i,
          incompatible: c.solidIncompatible
        }), m = /* @__PURE__ */ new Map();
        f.displacements.forEach(([b, p, C], J) => m.set(J, [
          b,
          p,
          C,
          0,
          0,
          0
        ])), t.deformOutputs.val = {
          deformations: m,
          reactions: /* @__PURE__ */ new Map()
        }, t.analyzeOutputs.val = {
          solidStress: f.stressPerElement,
          solidVonMises: f.vonMisesPerElement
        }, console.log(`[CLI Modeler] Solve OK \u2014 ${L.length} solidos H8, ${E.length} nodos (${f.elapsedMs.toFixed(0)} ms)`);
      } catch (s) {
        c.errors.push(`hex8Solve: ${(s == null ? void 0 : s.message) ?? s}`);
      }
      else if (c.doSolve && E.length && L.length) try {
        window.__hekatanCliSprings = ee;
        const s = Je({
          Dead: q,
          ...Object.fromEntries(K)
        });
        t.deformOutputs.val = He(E, L, {
          ...t.nodeInputs.val,
          loads: s
        }, t.elementInputs.val, ee.length ? ee : void 0);
        try {
          t.analyzeOutputs.val = Ve(E, L, t.elementInputs.val, t.deformOutputs.val);
        } catch (h) {
          console.warn("[CLI Modeler] analyze:", (h == null ? void 0 : h.message) ?? h);
        }
        if (c.areaSprings.length > 0) try {
          const h = t.deformOutputs.val.deformations, k = t.analyzeOutputs.val ?? {}, i = k.pressure instanceof Map ? k.pressure : /* @__PURE__ */ new Map();
          let f = 0, m = 0;
          for (const b of c.areaSprings) {
            const p = _.get(b.id);
            if (p === void 0) continue;
            const J = L[p].map((I) => {
              var _a2;
              const x = ((_a2 = h.get(I)) == null ? void 0 : _a2[2]) ?? 0, y = b.ks * x;
              return y < f && (f = y), y > m && (m = y), y;
            });
            i.set(p, J);
          }
          i.size > 0 && (k.pressure = i, k.colorMapRanges = {
            ...k.colorMapRanges ?? {},
            pressure: [
              m,
              f
            ]
          }, t.analyzeOutputs.val = k, console.log(`[CLI Modeler] presi\xF3n Winkler: ${i.size} shells, \u03C3 ${f.toFixed(0)}..${m.toFixed(0)} kN/m\xB2`));
        } catch (h) {
          console.warn("[CLI Modeler] presi\xF3n:", (h == null ? void 0 : h.message) ?? h);
        }
        if (ae.length > 0) try {
          const h = t.deformOutputs.val.deformations, k = /* @__PURE__ */ new Map(), i = /* @__PURE__ */ new Map();
          for (const f of ae) {
            const m = L[f], b = m.map((J) => E[J]), p = m.flatMap((J) => {
              const I = h.get(J) ?? [
                0,
                0,
                0
              ];
              return [
                I[0],
                I[1],
                I[2]
              ];
            }), C = Ge(b, o.get(f) ?? 25e6, U.get(f) ?? 0.2, p, c.solidIncompatible);
            k.set(f, C.stress), i.set(f, C.vonMises);
          }
          t.analyzeOutputs.val = {
            ...t.analyzeOutputs.val ?? {},
            solidStress: k,
            solidVonMises: i
          };
        } catch (h) {
          console.warn("[CLI Modeler] tensiones de solidos:", (h == null ? void 0 : h.message) ?? h);
        }
        console.log("[CLI Modeler] Solve OK \u2014", L.length, "elementos,", E.length, "nodos");
      } catch (s) {
        c.errors.push(`solve fall\xF3: ${s.message}`);
      }
      if (t.objects3D.val = [], c.errors.length) {
        console.warn("[CLI Modeler] Errores:");
        for (const s of c.errors) console.warn("  -", s);
      }
      window.__hekatanCliErrors = c.errors;
      let se = 0, ge = 0;
      const le = t.deformOutputs.val;
      if ((_a = le == null ? void 0 : le.deformations) == null ? void 0 : _a.size) for (const [, s] of le.deformations) Math.abs(s[2]) > Math.abs(se) && (se = s[2]);
      if ((_b = le == null ? void 0 : le.reactions) == null ? void 0 : _b.size) for (const [, s] of le.reactions) ge += s[2] || 0;
      window.__hekatanCliStats = {
        nodes: E.length,
        frames: c.frames.length,
        shells: c.shells.length,
        supports: te.size,
        loads: q.size,
        springs: ee.length,
        solved: c.doSolve,
        errors: c.errors.length,
        maxUzMm: +(se * 1e3).toFixed(3),
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
