import { i as Ve, t as Ze, c as He, d as Ke, a as Qe, b as es } from "./cadSections-BcRFaG1j.js";
import { c as qe } from "./cargasPorCaso-B_GZ_-rO.js";
import { h as ss, a as ts, __tla as __tla_0 } from "./h8-Dq5Es-cV.js";
import { a as os, __tla as __tla_1 } from "./analyze-CW2pK7-V.js";
import { m as ns, d as as, __tla as __tla_2 } from "./didacticCpp-Czy7NlhT.js";
let Ms, cs;
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
  const is = false;
  function rs(u) {
    if (typeof document > "u") return;
    const t = "hk-banner-sin-rigidez";
    let O = document.getElementById(t);
    if (!u.length) {
      O == null ? void 0 : O.remove();
      return;
    }
    O || (O = document.createElement("div"), O.id = t, O.style.cssText = "position:fixed;top:8px;left:50%;transform:translateX(-50%);z-index:1000;max-width:90vw;background:#7a1414;color:#fff;border:2px solid #ff4d4d;border-radius:6px;padding:8px 14px;font:bold 13px sans-serif;box-shadow:0 2px 10px rgba(0,0,0,.5);white-space:pre-line", document.body.appendChild(O)), O.textContent = "\u26A0 " + u.join(`
\u26A0 `);
  }
  const Ne = {
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
  function Be(u) {
    const t = u.toLowerCase().trim();
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
    const O = [
      false,
      false,
      false,
      false,
      false,
      false
    ], d = t.split(/[\s,]+/).filter(Boolean);
    if (d.length > 1 && d.length <= 6 && d.every((A) => A === "0" || A === "1")) return d.forEach((A, q) => {
      O[q] = A === "1";
    }), O;
    for (const A of d) Ne[A] !== void 0 && (O[Ne[A]] = true);
    if (/^[01]+$/.test(t) && t.length <= 6) for (let A = 0; A < t.length; A++) O[A] = t[A] === "1";
    return O;
  }
  cs = function(u) {
    const t = {
      nodes: /* @__PURE__ */ new Map(),
      frames: [],
      shells: [],
      shellLoads: /* @__PURE__ */ new Map(),
      shellLoadsPat: /* @__PURE__ */ new Map(),
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
    let O = null, d = 0, A = 0, q = 0;
    const D = u.split(/\r?\n/);
    for (let U = 0; U < D.length; U++) {
      let k = D[U].trim();
      if (!k || k.startsWith("#") || k.startsWith("//")) continue;
      k = k.replace(/[;]+$/, "");
      const o = k.split(/\s+/), N = o[0].toLowerCase();
      if (N === "nodes" && o.length === 1) {
        O = "nodes";
        continue;
      }
      if ((N === "elements" || N === "frames") && o.length === 1) {
        O = "elements";
        continue;
      }
      if (N === "areas" && o.length === 1) {
        O = "areas";
        continue;
      }
      if (N === "supports" && o.length === 1) {
        O = "supports";
        continue;
      }
      if (N === "loads" && o.length === 1) {
        O = "loads";
        continue;
      }
      if (N === "springs" && o.length === 1) {
        O = "springs";
        continue;
      }
      if (O && /^[\-\d]/.test(o[0])) {
        const e = o.map(parseFloat);
        if (O === "nodes" && e.length >= 3) {
          d++, t.nodes.set(d, [
            e[0],
            e[1],
            e[2]
          ]);
          continue;
        }
        if (O === "elements" && e.length >= 2) {
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
        if (O === "areas" && e.length >= 4) {
          q++, t.shells.push({
            id: q,
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
        if (O === "loads" && e.length >= 4) {
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
        if (O === "springs" && e.length >= 3) {
          t.springs.push({
            node: e[0],
            dof: e[1],
            k: e[2]
          });
          continue;
        }
      }
      if (O === "supports" && /^\d/.test(o[0])) {
        const e = parseInt(o[0], 10), a = o.slice(1).join(" ");
        t.supports.set(e, Be(a));
        continue;
      }
      O && !/^[\-\d]/.test(o[0]) && (O = null);
      try {
        switch (N) {
          case "node":
          case "n": {
            const e = parseInt(o[1], 10), a = parseFloat(o[2]), i = parseFloat(o[3]), r = parseFloat(o[4]);
            !isFinite(e) || !isFinite(a) || !isFinite(i) || !isFinite(r) ? t.errors.push(`L${U + 1}: node mal formado: ${k}`) : t.nodes.set(e, [
              a,
              i,
              r
            ]);
            break;
          }
          case "frame":
          case "beam":
          case "column":
          case "f": {
            const e = parseInt(o[1], 10), a = parseInt(o[2], 10), i = parseInt(o[3], 10), r = parseFloat(o[4] ?? "25e6"), h = parseFloat(o[5] ?? "0.16"), F = parseFloat(o[6] ?? "0.001"), x = o[7] !== void 0 ? parseFloat(o[7]) : void 0, m = o[8] !== void 0 ? parseFloat(o[8]) : void 0, E = o[9] !== void 0 ? parseFloat(o[9]) : void 0, I = o[10] !== void 0 ? parseFloat(o[10]) : void 0, R = o[11] !== void 0 ? parseFloat(o[11]) : void 0, P = o[12] !== void 0 ? parseFloat(o[12]) : void 0, Z = o.indexOf("#"), j = Z >= 0 && o[Z + 1] ? o[Z + 1] : void 0;
            t.frames.push({
              id: e,
              nI: a,
              nJ: i,
              E: r,
              A: h,
              I: F,
              Iy: x,
              J: m,
              nu: E,
              rho: I,
              D: R,
              B: P,
              sec: j
            });
            break;
          }
          case "cftc": {
            const e = parseInt(o[1], 10), a = parseFloat(o[2] ?? ""), i = parseFloat(o[3] ?? ""), r = parseFloat(o[4] ?? "25e6"), h = parseFloat(o[5] ?? "0.2"), F = parseFloat(o[6] ?? "2.4");
            isFinite(e) && a > 0 && i > 0 && i < a / 2 && r > 0 ? t.frameCftc.set(e, {
              D: a,
              t: i,
              Ec: r,
              nuC: isFinite(h) ? h : 0.2,
              rhoC: isFinite(F) && F >= 0 ? F : 2.4
            }) : t.errors.push(`cftc ${o[1]}: hace falta D t (m) y Ec (kN/m2), con t < D/2`);
            break;
          }
          case "isec":
          case "perfili": {
            const e = parseInt(o[1], 10), a = o.slice(2, 8).map((E) => parseFloat(E)), [i, r, h, F] = a, x = isFinite(a[4]) ? a[4] : r, m = isFinite(a[5]) ? a[5] : h;
            isFinite(e) && i > 0 && r > 0 && h > 0 && F > 0 && x > 0 && m > 0 && h + m < i && F < Math.min(r, x) ? t.frameISec.set(e, {
              d: i,
              bf: r,
              tf: h,
              tw: F,
              t2b: x,
              tfb: m
            }) : t.errors.push(`isec ${o[1]}: hace falta d bf tf tw [t2b tfb] (m), con tf+tfb < d y tw < bf`);
            break;
          }
          case "tubo":
          case "tube": {
            const e = parseInt(o[1], 10), [a, i, r, h] = o.slice(2, 6).map((F) => parseFloat(F));
            isFinite(e) && a > 0 && i > 0 && r > 0 && h > 0 && h < a / 2 && r < i / 2 ? t.frameTube.set(e, {
              b: a,
              h: i,
              tf: r,
              tw: h
            }) : t.errors.push(`tubo ${o[1]}: hace falta b h tf tw (m), con tw < b/2 y tf < h/2`);
            break;
          }
          case "canal":
          case "channel": {
            const e = parseInt(o[1], 10), [a, i, r, h] = o.slice(2, 6).map((F) => parseFloat(F));
            isFinite(e) && a > 0 && i > 0 && r > 0 && h > 0 && 2 * r < a && h < i ? t.frameCanal.set(e, {
              d: a,
              bf: i,
              tf: r,
              tw: h
            }) : t.errors.push(`canal ${o[1]}: hace falta d bf tf tw (m), con 2\xB7tf < d y tw < bf`);
            break;
          }
          case "dosl":
          case "2l": {
            const e = parseInt(o[1], 10), [a, i, r, h, F] = o.slice(2, 7).map((m) => parseFloat(m)), x = (i - (F || 0)) / 2;
            isFinite(e) && a > 0 && i > 0 && r > 0 && h > 0 && F >= 0 && x > h && r < a ? t.frameDosL.set(e, {
              d: a,
              t2: i,
              tf: r,
              tw: h,
              dis: F
            }) : t.errors.push(`dosl ${o[1]}: hace falta d t2 tf tw dis (m), con (t2 \u2212 dis)/2 > tw`);
            break;
          }
          case "cft": {
            const e = parseInt(o[1], 10), a = o.slice(2).map((P) => parseFloat(P)), i = a.length >= 5 && a[3] < 1 && a[4] >= 1, r = a[0], h = a[1], F = a[2], x = i ? a[3] : a[2], m = i ? 4 : 3, E = isFinite(a[m]) ? a[m] : 25e6, I = isFinite(a[m + 1]) ? a[m + 1] : 0.2, R = isFinite(a[m + 2]) ? a[m + 2] : 2.4;
            isFinite(e) && r > 0 && h > 0 && F > 0 && x > 0 && x < r / 2 && F < h / 2 && E > 0 ? t.frameCft.set(e, {
              b: r,
              h,
              t: F,
              tw: x,
              Ec: E,
              nuC: I,
              rhoC: R >= 0 ? R : 2.4
            }) : t.errors.push(`cft ${o[1]}: hace falta b h t [tw] (m) y Ec (kN/m2), con tw < b/2 y t < h/2`);
            break;
          }
          case "as":
          case "shearareas": {
            const e = parseInt(o[1], 10), a = parseFloat(o[2] ?? "0"), i = parseFloat(o[3] ?? "0");
            isFinite(e) && isFinite(a) && isFinite(i) && t.frameShearAreas.set(e, [
              a,
              i
            ]);
            break;
          }
          case "release":
          case "rel": {
            const e = parseInt(o[1], 10), a = o.slice(2).map((r) => r.toLowerCase());
            if (!isFinite(e) || a.length === 0) {
              t.errors.push('release: se esperaba "release frameID <12 bits> | pin fix"');
              break;
            }
            const i = new Array(12).fill(false);
            if (a.length === 2 && a.every((r) => /^(pin|fix|libre|rigido)$/.test(r))) a.forEach((r, h) => {
              (r === "pin" || r === "libre") && (i[h * 6 + 4] = true, i[h * 6 + 5] = true);
            });
            else {
              const r = a.filter((h) => h === "0" || h === "1");
              if (r.length !== 12) {
                t.errors.push(`release ${e}: hacen falta 12 banderas (U1 U2 U3 R1 R2 R3 en I y en J), llegaron ${r.length}`);
                break;
              }
              for (let h = 0; h < 12; h++) i[h] = r[h] === "1";
            }
            i.some(Boolean) && t.frameReleases.set(e, i);
            break;
          }
          case "hex":
          case "solid":
          case "h8": {
            const e = parseInt(o[1], 10), a = o.slice(2, 10).map((i) => parseInt(i, 10));
            if (!isFinite(e) || a.length !== 8 || a.some((i) => !isFinite(i))) {
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
            if (!isFinite(e) || a.length < 5 || a.slice(0, 5).some((i) => !isFinite(i) || i < 0) || !(a[0] > 0)) {
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
            const e = parseInt(o[1], 10), a = parseFloat(o[2] ?? "0"), i = o.slice(3).some((h) => /^(nodal|lumped|sap|etabs)$/i.test(h)), r = o.slice(3).some((h) => /^(compresion|compression|compressiononly|solocompresion)$/i.test(h));
            isFinite(e) && isFinite(a) && a !== 0 ? t.areaSprings.push({
              id: e,
              ks: a,
              nodal: i,
              comp: r
            }) : t.errors.push("areaspring: uso areaspring <shellID> <ks> [nodal]");
            break;
          }
          case "edge":
          case "edgeconstraint": {
            const e = (o[1] ?? "etabs").toLowerCase();
            t.edgeEtabs = e === "etabs" || e === "1" || e === "on" || e === "si" || e === "hermite", t.edgeLineal = e === "lineal" || e === "linear" || e === "safe" || e === "sap" || e === "linea", t.edgeLineal && !is ? (t.errors.push("edge lineal: este motor aun no lo aplica (llega con el WASM nuevo); los nudos colgados quedan sin atar"), t.edgeLineal = false) : t.edgeLineal && (t.edgeEtabs = true);
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
            const e = parseInt(o[1], 10), a = parseFloat(o[2] ?? "0"), i = parseFloat(o[3] ?? "0"), r = parseFloat(o[4] ?? "0");
            if (!isFinite(e) || !isFinite(a) || !isFinite(i)) {
              t.errors.push('endoffset: se esperaba "endoffset frameID offI offJ [rz]"');
              break;
            }
            t.frameEndOffsets.set(e, [
              a,
              i,
              isFinite(r) ? r : 0
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
            ], i = parseFloat(o[6] ?? "0.20"), r = parseFloat(o[7] ?? "25e6"), h = o[9] !== void 0 ? parseFloat(o[9]) : void 0, F = h !== void 0 && isFinite(h) ? h : void 0;
            if (t.shells.push({
              id: e,
              pts: a,
              t: i,
              E: r,
              rho: F
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
            let i;
            if (a === "thin" || a === "delgada" || a === "kirchhoff" || a === "1" ? i = 1 : (a === "thick" || a === "gruesa" || a === "mindlin" || a === "0") && (i = 0), i === void 0) {
              t.errors.push(`shelltype ${e}: se esperaba thin o thick`);
              break;
            }
            t.shellTypes.set(e, i);
            break;
          }
          case "shellmod": {
            const e = parseInt(o[1], 10);
            if (!isFinite(e)) break;
            const a = o.slice(2).map(parseFloat);
            if (a.length >= 8) t.shellModsDir.set(e, a.slice(0, 8).map((i) => isFinite(i) ? i : 1));
            else {
              const i = a[0], r = a[1];
              t.shellMods.set(e, [
                isFinite(i) ? i : 1,
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
            const [a, i, r, h, F, x, m] = e, E = [];
            for (let I = x; I <= m; I++) E.push(I);
            t.areaObjs.push({
              id: a,
              pts: [
                i,
                r,
                h,
                F
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
              t.errors.push('areaload: se esperaba "areaload shellID q [patron]"');
              break;
            }
            const i = o[3] && isNaN(parseFloat(o[3])) ? o[3] : "Dead";
            /^dead$/i.test(i) ? t.shellLoads.set(e, a) : (t.shellLoadsPat.has(i) || t.shellLoadsPat.set(i, /* @__PURE__ */ new Map()), t.shellLoadsPat.get(i).set(e, a));
            break;
          }
          case "support":
          case "fix": {
            const e = parseInt(o[1], 10), a = o.findIndex((r, h) => h >= 2 && r.startsWith("#")), i = o.slice(2, a < 0 ? void 0 : a).join(" ");
            t.supports.set(e, Be(i));
            break;
          }
          case "load":
          case "l": {
            const e = parseInt(o[1], 10), a = parseFloat(o[2] ?? "0"), i = parseFloat(o[3] ?? "0"), r = parseFloat(o[4] ?? "0"), h = parseFloat(o[5] ?? "0"), F = parseFloat(o[6] ?? "0"), x = parseFloat(o[7] ?? "0"), m = o[8] && isNaN(parseFloat(o[8])) ? o[8] : "Dead";
            /^dead$/i.test(m) ? t.loads.set(e, [
              a,
              i,
              r,
              h,
              F,
              x
            ]) : (t.loadsPat.has(m) || t.loadsPat.set(m, /* @__PURE__ */ new Map()), t.loadsPat.get(m).set(e, [
              a,
              i,
              r,
              h,
              F,
              x
            ]));
            break;
          }
          case "frameload":
          case "fl": {
            const e = parseInt(o[1], 10), a = parseFloat(o[2] ?? "0"), i = parseFloat(o[3] ?? "0"), r = parseFloat(o[4] ?? "0"), h = o[5] && isNaN(parseFloat(o[5])) ? o[5] : "Dead", F = /^dead$/i.test(h) ? t.frameLoads : t.frameLoadsPat.get(h) ?? (t.frameLoadsPat.set(h, /* @__PURE__ */ new Map()), t.frameLoadsPat.get(h)), x = F.get(e) ?? [
              0,
              0,
              0
            ];
            F.set(e, [
              x[0] + a,
              x[1] + i,
              x[2] + r
            ]);
            break;
          }
          case "spring": {
            const e = parseInt(o[1], 10), a = (o[2] ?? "uz").toLowerCase(), i = Ne[a] ?? 2, r = parseFloat(o[3] ?? "1000");
            t.springs.push({
              node: e,
              dof: i,
              k: r
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
            Number.isFinite(e) && Number.isFinite(a) ? t.masses.set(e, (t.masses.get(e) ?? 0) + a) : t.errors.push(`L${U + 1}: mass necesita <nudo> <toneladas>`);
            break;
          }
          case "vista": {
            const e = o.slice(1).filter((a) => !/^resultados?$/i.test(a));
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
            const e = o[1], a = [];
            for (let i = 2; i + 1 < o.length; i += 2) {
              const r = parseFloat(o[i + 1]);
              isFinite(r) && a.push([
                o[i],
                r
              ]);
            }
            e && a.length ? t.combos.push({
              name: e,
              items: a
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
            t.errors.push(`L${U + 1}: comando desconocido "${N}"`);
        }
      } catch (e) {
        t.errors.push(`L${U + 1}: error "${k}" \u2014 ${e.message}`);
      }
    }
    return t;
  };
  const ls = `# CLI Modeler \u2014 escrib\xED comandos para construir un modelo
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
`, V = (u, t) => [
    u[0] - t[0],
    u[1] - t[1],
    u[2] - t[2]
  ], he = (u, t) => u[0] * t[0] + u[1] * t[1] + u[2] * t[2], Fe = (u, t) => [
    u[1] * t[2] - u[2] * t[1],
    u[2] * t[0] - u[0] * t[2],
    u[0] * t[1] - u[1] * t[0]
  ], Q = (u) => Math.hypot(u[0], u[1], u[2]), re = (u, t) => [
    u[0] * t,
    u[1] * t,
    u[2] * t
  ];
  function Ue(u, t) {
    const O = u.shellModsDir.get(t);
    return !!O && Math.abs(O[3]) < 1e-12 && Math.abs(O[4]) < 1e-12 && Math.abs(O[5]) < 1e-12;
  }
  function ds(u, t = 200, O) {
    const d = [
      0,
      1,
      2
    ].map((m) => (u[0][m] + u[1][m] + u[2][m] + u[3][m]) / 4);
    let A = V(u[1], u[0]), q = Fe(A, V(u[3], u[0]));
    q = re(q, 1 / Q(q)), A = re(A, 1 / Q(A));
    const D = Fe(q, A), U = u.map((m) => [
      he(V(m, d), A),
      he(V(m, d), D)
    ]);
    let k = [
      0,
      1,
      2,
      3
    ];
    if (O) {
      const m = [
        0,
        1,
        2,
        3
      ].map((E) => {
        const I = V(u[(E + 1) % 4], u[E]);
        return Math.abs(he(I, O)) / Q(I);
      });
      k = [
        0,
        1,
        2,
        3
      ].sort((E, I) => m[E] - m[I]).slice(0, 2);
    }
    const o = U.map((m) => m[0]), N = U.map((m) => m[1]), e = Math.min(...o), a = Math.max(...o), i = Math.min(...N), r = Math.max(...N), h = [
      0,
      1,
      2,
      3
    ].map(() => ({
      pts: [],
      dA: 0
    }));
    let F = 0;
    for (let m = 0; m < t; m++) for (let E = 0; E < t; E++) {
      const I = e + (a - e) * (m + 0.5) / t, R = i + (r - i) * (E + 0.5) / t;
      let P = 0, Z = 0;
      for (let B = 0; B < 4; B++) {
        const G = U[B], se = U[(B + 1) % 4];
        (se[0] - G[0]) * (R - G[1]) - (se[1] - G[1]) * (I - G[0]) >= 0 ? P++ : Z++;
      }
      if (P !== 4 && Z !== 4) continue;
      let j = k[0], J = 1 / 0;
      for (const B of k) {
        const G = U[B], se = U[(B + 1) % 4], ne = se[0] - G[0], W = se[1] - G[1], ue = ne * ne + W * W, le = Math.max(0, Math.min(1, ((I - G[0]) * ne + (R - G[1]) * W) / ue)), H = Math.hypot(I - (G[0] + le * ne), R - (G[1] + le * W));
        H < J && (J = H, j = B);
      }
      h[j].pts.push([
        d[0] + I * A[0] + R * D[0],
        d[1] + I * A[1] + R * D[1],
        d[2] + I * A[2] + R * D[2]
      ]), F++;
    }
    const x = 0.5 * Q(Fe(V(u[2], u[0]), V(u[3], u[1])));
    for (const m of h) m.dA = F ? x / F : 0;
    return h;
  }
  function fs(u, t) {
    if (!(t > 0)) return;
    const O = 1e-6, d = (N) => u.nodes.get(N);
    let A = Math.max(0, ...u.nodes.keys()) + 1, q = u.shells.reduce((N, e) => Math.max(N, e.id), 0) + 1;
    const D = (N) => {
      for (const [a, i] of u.nodes) if (Q(V(i, N)) < O) return a;
      const e = A++;
      return u.nodes.set(e, [
        N[0],
        N[1],
        N[2]
      ]), e;
    }, U = (N, e) => {
      const a = u.shellModsDir.get(N);
      a && u.shellModsDir.set(e, [
        ...a
      ]);
      const i = u.shellMods.get(N);
      i && u.shellMods.set(e, [
        ...i
      ]);
      const r = u.shellLoads.get(N);
      r !== void 0 && u.shellLoads.set(e, r);
      const h = u.shellTypes.get(N);
      h !== void 0 && u.shellTypes.set(e, h);
      const F = u.shellAngles.get(N);
      F !== void 0 && u.shellAngles.set(e, F);
    }, k = [];
    let o = 0;
    for (const N of u.shells) {
      if (N.pts.length !== 4) {
        k.push(N);
        continue;
      }
      const e = N.pts.map(d);
      if (e.some((m) => !m)) {
        k.push(N);
        continue;
      }
      const a = (Q(V(e[1], e[0])) + Q(V(e[2], e[3]))) / 2, i = (Q(V(e[3], e[0])) + Q(V(e[2], e[1]))) / 2, r = Math.max(1, Math.ceil(a / t - 1e-9)), h = Math.max(1, Math.ceil(i / t - 1e-9));
      if (r === 1 && h === 1) {
        k.push(N);
        continue;
      }
      const F = (m, E) => [
        0,
        1,
        2
      ].map((I) => e[0][I] * (1 - m) * (1 - E) + e[1][I] * m * (1 - E) + e[2][I] * m * E + e[3][I] * (1 - m) * E), x = [];
      for (let m = 0; m <= r; m++) {
        const E = [];
        for (let I = 0; I <= h; I++) E.push(D(F(m / r, I / h)));
        x.push(E);
      }
      for (let m = 0; m < r; m++) for (let E = 0; E < h; E++) {
        const I = m === 0 && E === 0 ? N.id : q++;
        k.push({
          ...N,
          id: I,
          pts: [
            x[m][E],
            x[m + 1][E],
            x[m + 1][E + 1],
            x[m][E + 1]
          ]
        }), I !== N.id && U(N.id, I);
      }
      o++;
    }
    o && (u.shells = k, console.log(`[CLI Modeler] automesh ${t} m: ${o} pano(s) partido(s) -> ${u.shells.length} cascaras, ${u.nodes.size} nudos`));
  }
  function ps(u) {
    const O = (i) => u.nodes.get(i), d = [
      ...u.nodes.keys()
    ], A = (i, r, h) => {
      const F = V(r, i), x = Q(F), m = re(F, 1 / x), E = [];
      for (const I of d) {
        if (h.includes(I)) continue;
        const R = V(O(I), i), P = he(R, m);
        P > 1e-6 && P < x - 1e-6 && Q(V(R, re(m, P))) < 1e-4 && E.push(P / x);
      }
      return E.sort((I, R) => I - R);
    }, q = (i, r) => {
      const h = [];
      for (const F of i) r.some((x) => Math.abs(F - x) < 1e-5) && !h.some((x) => Math.abs(F - x) < 1e-5) && h.push(F);
      return h;
    }, D = (i) => {
      for (const r of d) if (Q(V(O(r), i)) < 1e-4) return r;
    };
    let U = u.shells.reduce((i, r) => Math.max(i, r.id), 0) + 1;
    const k = [], o = (i, r) => {
      const h = u.shellModsDir.get(i);
      h && u.shellModsDir.set(r, [
        ...h
      ]);
      const F = u.shellMods.get(i);
      F && u.shellMods.set(r, [
        ...F
      ]);
      const x = u.shellLoads.get(i);
      x !== void 0 && u.shellLoads.set(r, x);
      const m = u.shellTypes.get(i);
      m !== void 0 && u.shellTypes.set(r, m);
      const E = u.shellAngles.get(i);
      E !== void 0 && u.shellAngles.set(r, E);
    };
    for (const i of u.shells) {
      if (!Ue(u, i.id) || i.pts.length !== 4 || i.pts.some((j) => !u.nodes.has(j))) {
        k.push(i);
        continue;
      }
      const r = i.pts.map(O), h = A(r[0], r[1], i.pts), F = A(r[2], r[3], i.pts).map((j) => 1 - j), x = A(r[1], r[2], i.pts), m = A(r[3], r[0], i.pts).map((j) => 1 - j);
      let E = [
        0,
        ...q(h, F),
        1
      ], I = [
        0,
        ...q(x, m),
        1
      ];
      if (E.length === 2 && I.length === 2) {
        k.push(i);
        continue;
      }
      const R = (j, J) => [
        0,
        1,
        2
      ].map((B) => (1 - j) * (1 - J) * r[0][B] + j * (1 - J) * r[1][B] + j * J * r[2][B] + (1 - j) * J * r[3][B]);
      let P = I.map((j) => E.map((J) => D(R(J, j))));
      if (P.some((j) => j.some((J) => J === void 0)) && (E.length >= I.length ? I = [
        0,
        1
      ] : E = [
        0,
        1
      ], P = I.map((j) => E.map((J) => D(R(J, j)))), P.some((j) => j.some((J) => J === void 0)))) {
        k.push(i);
        continue;
      }
      let Z = true;
      for (let j = 0; j < I.length - 1; j++) for (let J = 0; J < E.length - 1; J++) {
        const B = [
          P[j][J],
          P[j][J + 1],
          P[j + 1][J + 1],
          P[j + 1][J]
        ], G = Z ? i.id : U++;
        Z || o(i.id, G), Z = false, k.push({
          id: G,
          pts: B,
          t: i.t,
          E: i.E,
          rho: i.rho
        });
      }
    }
    u.shells = k;
    const N = 9.80665, e = (i, r) => {
      const h = u.loads.get(i) ?? [
        0,
        0,
        0,
        0,
        0,
        0
      ];
      u.loads.set(i, [
        h[0] + r[0],
        h[1] + r[1],
        h[2] + r[2],
        h[3] + r[3],
        h[4] + r[4],
        h[5] + r[5]
      ]);
    }, a = (i, r) => {
      const h = V(r, i), F = Q(h), x = re(h, 1 / F);
      return u.frames.filter((m) => [
        m.nI,
        m.nJ
      ].every((E) => {
        const I = u.nodes.get(E);
        if (!I) return false;
        const R = V(I, i), P = he(R, x);
        return P > -1e-4 && P < F + 1e-4 && Q(V(R, re(x, P))) < 1e-4;
      }));
    };
    for (const i of u.shells) {
      if (!Ue(u, i.id) || i.pts.length !== 4) continue;
      const r = u.selfWeight ? (i.rho ?? 2.45) * i.t * N * u.selfWeight : 0, h = u.shellLoads.get(i.id) ?? 0, F = -r + h;
      if (Math.abs(F) < 1e-15) continue;
      const x = i.pts.map(O);
      let m;
      if (u.deckOneWay) {
        const I = V(x[1], x[0]);
        let R = Fe(I, V(x[3], x[0]));
        R = re(R, 1 / Q(R));
        const P = re(I, 1 / Q(I)), Z = Fe(R, P), j = (u.shellAngles.get(i.id) ?? 0) * Math.PI / 180;
        m = [
          0,
          1,
          2
        ].map((J) => Math.cos(j) * P[J] + Math.sin(j) * Z[J]);
      }
      const E = ds(x, 200, m);
      for (let I = 0; I < 4; I++) {
        const { pts: R, dA: P } = E[I];
        if (!R.length) continue;
        const Z = x[I], j = x[(I + 1) % 4], J = a(Z, j);
        if (!J.length) {
          const W = F * P * R.length;
          e(i.pts[I], [
            0,
            0,
            W / 2,
            0,
            0,
            0
          ]), e(i.pts[(I + 1) % 4], [
            0,
            0,
            W / 2,
            0,
            0,
            0
          ]);
          continue;
        }
        const B = V(j, Z), G = Q(B), se = re(B, 1 / G), ne = R.map((W) => he(V(W, Z), se));
        for (const W of J) {
          const ue = O(W.nI), le = O(W.nJ), H = he(V(ue, Z), se), Me = he(V(le, Z), se), we = Math.min(H, Me), de = Math.max(H, Me), ce = de - we;
          if (ce < 1e-9) continue;
          const ke = de >= G - 1e-6, te = re(V(le, ue), 1 / ce), ee = Fe(te, [
            0,
            0,
            1
          ]);
          let fe = 0, me = 0, Le = 0, ae = 0;
          for (const ie of ne) {
            if (ie < we - 1e-9 || (ke ? ie > de + 1e-9 : ie >= de - 1e-9)) continue;
            let pe = ie - we;
            H > Me && (pe = ce - pe);
            const Y = pe / ce;
            fe += 1 - 3 * Y * Y + 2 * Y * Y * Y, me += ce * (Y - 2 * Y * Y + Y * Y * Y), Le += 3 * Y * Y - 2 * Y * Y * Y, ae += ce * (-Y * Y + Y * Y * Y);
          }
          const oe = F * P;
          e(W.nI, [
            0,
            0,
            oe * fe,
            ee[0] * oe * me,
            ee[1] * oe * me,
            ee[2] * oe * me
          ]), e(W.nJ, [
            0,
            0,
            oe * Le,
            ee[0] * oe * ae,
            ee[1] * oe * ae,
            ee[2] * oe * ae
          ]);
        }
      }
      u.deckTributario.add(i.id), u.shellLoads.delete(i.id);
    }
  }
  Ms = {
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
    runModal(u, t, O) {
      var _a;
      const d = t.nodes.val, A = t.elements.val;
      if (!(!d.length || !A.length)) try {
        const q = Math.max(1, parseInt(window.__hekatanCliModalModes ?? "12", 10) || 12), D = t.nodeInputs.val, U = window.__hekatanCliSprings, k = ns(d, A, D, t.elementInputs.val, q, 0, 0, 1, (D == null ? void 0 : D.diaphragms) instanceof Map && D.diaphragms.size ? D.diaphragms : void 0, U && U.length ? U : void 0);
        console.log(`[CLI Modeler] Modal OK \u2014 ${k.frequencies.length} modos, T1 = ${k.frequencies[0] ? (1 / k.frequencies[0]).toFixed(5) : "\u2014"} s`), (_a = O == null ? void 0 : O.render) == null ? void 0 : _a.call(O, k, {
          title: "Modal del .heks (masa 3D, como SAP2000)"
        });
      } catch (q) {
        console.error("[CLI Modeler] modal:", (q == null ? void 0 : q.message) ?? q);
      }
    },
    build(u, t) {
      var _a, _b, _c, _d;
      const O = window.__hekatanCliScript ?? ls;
      window.__hekatanCliLastScript = O;
      const d = cs(O);
      d.autoMesh > 0 && fs(d, d.autoMesh), d.deckEtabs && ps(d);
      const A = /* @__PURE__ */ new Map(), q = /* @__PURE__ */ new Map(), D = [], U = Array.from(d.nodes.keys()).sort((s, l) => s - l);
      for (const s of U) A.set(s, D.length), D.push(d.nodes.get(s));
      const k = [], o = /* @__PURE__ */ new Map(), N = /* @__PURE__ */ new Map(), e = /* @__PURE__ */ new Map(), a = /* @__PURE__ */ new Map(), i = /* @__PURE__ */ new Map(), r = /* @__PURE__ */ new Map(), h = /* @__PURE__ */ new Map(), F = /* @__PURE__ */ new Map(), x = /* @__PURE__ */ new Map(), m = /* @__PURE__ */ new Map(), E = /* @__PURE__ */ new Map(), I = /* @__PURE__ */ new Map(), R = /* @__PURE__ */ new Map(), P = /* @__PURE__ */ new Map(), Z = /* @__PURE__ */ new Map(), j = /* @__PURE__ */ new Map(), J = /* @__PURE__ */ new Map(), B = /* @__PURE__ */ new Map(), G = /* @__PURE__ */ new Map(), se = /* @__PURE__ */ new Map();
      for (const s of d.frames) {
        const l = A.get(s.nI), p = A.get(s.nJ);
        if (l === void 0 || p === void 0) {
          const w = U.length ? `IDs disponibles: ${U.join(", ")}` : "ning\xFAn nodo definido", S = [];
          l === void 0 && S.push(s.nI), p === void 0 && S.push(s.nJ), d.errors.push(`frame ${s.id}: nodo(s) inexistente(s) [${S.join(", ")}] \u2014 ${w}`);
          continue;
        }
        const n = k.length;
        k.push([
          l,
          p
        ]);
        const c = s.nu ?? 0.2;
        o.set(n, s.E), N.set(n, s.E / (2 * (1 + c))), e.set(n, s.A), a.set(n, s.I), i.set(n, s.Iy ?? s.I), r.set(n, s.J ?? 0.14 * Math.pow(Math.sqrt(s.A), 4)), h.set(n, s.rho ?? 2.45), G.set(n, c), s.D !== void 0 && isFinite(s.D) && F.set(n, s.D), s.B !== void 0 && isFinite(s.B) && x.set(n, s.B);
        const g = d.frameAngles.get(s.id);
        g !== void 0 && isFinite(g) && E.set(n, g);
        const M = d.frameReleases.get(s.id);
        M && I.set(n, M);
        const f = d.frameEndOffsets.get(s.id);
        f && R.set(n, f);
        const L = d.frameLoads.get(s.id);
        L && j.set(n, L);
        const $ = d.frameShearAreas.get(s.id);
        if ($ && (B.set(n, $[0]), J.set(n, $[1])), s.sec || s.D !== void 0 && s.B !== void 0) {
          const w = {
            type: "general"
          };
          s.sec && (w.name = s.sec), s.D !== void 0 && isFinite(s.D) && (w.h = s.D), s.B !== void 0 && isFinite(s.B) && (w.b = s.B), m.set(n, w);
        }
        const b = d.frameISec.get(s.id);
        if (b) {
          const w = Ve(b.d, b.bf, b.tf, b.tw, b.t2b, b.tfb);
          e.set(n, w.A), i.set(n, w.Iz), a.set(n, w.Iy), r.set(n, w.J), B.set(n, w.As2), J.set(n, w.As3), F.set(n, b.d), x.set(n, Math.max(b.bf, b.t2b));
          const S = (_) => Math.round(_ * 1e4) / 10;
          m.set(n, {
            type: "I",
            h: b.d,
            b: b.bf,
            tf: b.tf,
            tw: b.tw,
            t2b: b.t2b,
            tfb: b.tfb,
            name: s.sec ?? `I${S(b.d)}X${S(b.bf)}X${S(b.tf)}X${S(b.tw)}`
          });
        }
        const v = d.frameTube.get(s.id);
        if (v) {
          const w = Ze(v.b, v.h, v.tf, v.tw);
          e.set(n, w.A), i.set(n, w.Iz), a.set(n, w.Iy), r.set(n, w.J), B.set(n, w.As2), J.set(n, w.As3), F.set(n, v.h), x.set(n, v.b);
          const S = (_) => Math.round(_ * 1e4) / 10;
          m.set(n, {
            type: "HSS",
            h: v.h,
            b: v.b,
            tf: v.tf,
            tw: v.tw,
            name: s.sec ?? `TUBO${S(v.h)}X${S(v.b)}X${S(v.tf)}X${S(v.tw)}`
          });
        }
        const y = d.frameCanal.get(s.id);
        if (y) {
          const w = He(y.d, y.bf, y.tf, y.tw);
          e.set(n, w.A), i.set(n, w.Iz), a.set(n, w.Iy), r.set(n, w.J), B.set(n, w.As2), J.set(n, w.As3), F.set(n, y.d), x.set(n, y.bf);
          const S = (_) => Math.round(_ * 1e4) / 10;
          m.set(n, {
            type: "C",
            h: y.d,
            b: y.bf,
            tf: y.tf,
            tw: y.tw,
            name: s.sec ?? `C${S(y.d)}X${S(y.bf)}X${S(y.tf)}X${S(y.tw)}`
          });
        }
        const T = d.frameDosL.get(s.id);
        if (T) {
          const w = Ke(T.d, T.t2, T.tf, T.tw, T.dis);
          e.set(n, w.A), i.set(n, w.Iz), a.set(n, w.Iy), r.set(n, w.J), B.set(n, w.As2), J.set(n, w.As3), F.set(n, T.d), x.set(n, T.t2);
          const S = (_) => Math.round(_ * 1e4) / 10;
          m.set(n, {
            type: "2L",
            h: T.d,
            b: T.t2,
            tf: T.tf,
            tw: T.tw,
            dis: T.dis,
            name: s.sec ?? `2L${S(T.d)}X${S(T.t2)}X${S(T.tf)}X${S(T.tw)}S${S(T.dis)}`
          });
        }
        const C = d.frameCftc.get(s.id);
        if (C) {
          const w = Qe(C.D, C.t, s.E, c, C.Ec, C.nuC);
          e.set(n, w.A), i.set(n, w.Iz), a.set(n, w.Iy), r.set(n, w.J), B.set(n, w.As2), J.set(n, w.As3), F.set(n, C.D), x.set(n, C.D);
          const S = C.D - 2 * C.t, _ = Math.PI * S * S / 4, X = Math.PI * C.D * C.D / 4 - _;
          h.set(n, ((s.rho ?? 7.85) * X + C.rhoC * _) / w.A), m.set(n, {
            type: "CFT",
            d: C.D,
            tw: C.t,
            fillE: C.Ec,
            fillRho: C.rhoC,
            steelRho: s.rho ?? 7.85,
            name: s.sec ?? `CFTC ${Math.round(C.D * 1e3)}X${Math.round(C.t * 1e3)}`
          });
        }
        const z = d.frameCft.get(s.id);
        if (z) {
          const w = es(z.b, z.h, z.t, s.E, c, z.Ec, z.nuC, z.tw);
          e.set(n, w.A), i.set(n, w.Iz), a.set(n, w.Iy), r.set(n, w.J), B.set(n, w.As2), J.set(n, w.As3), F.set(n, z.h), x.set(n, z.b);
          const S = (z.b - 2 * z.tw) * (z.h - 2 * z.t), _ = z.b * z.h - S;
          h.set(n, ((s.rho ?? 7.85) * _ + z.rhoC * S) / w.A);
          const X = (K) => Math.round(K * 1e3);
          m.set(n, {
            type: "CFT",
            b: z.b,
            h: z.h,
            tw: z.tw,
            tf: z.t,
            fillE: z.Ec,
            fillRho: z.rhoC,
            steelRho: s.rho ?? 7.85,
            name: s.sec ?? `CFT ${X(z.h)}X${X(z.b)}X${X(z.t)}${z.tw !== z.t ? `X${X(z.tw)}` : ""}`
          });
        }
      }
      if (d.meshCross) {
        const s = (M, f) => M[0] * f[0] + M[1] * f[1] + M[2] * f[2], l = [
          o,
          N,
          e,
          a,
          i,
          r,
          h,
          G,
          F,
          x,
          E,
          J,
          B,
          m,
          j
        ], p = (M, f) => {
          for (const L of l) L.has(M) && L.set(f, L.get(M));
        }, n = (M) => {
          for (let f = 0; f < D.length; f++) if (Math.hypot(D[f][0] - M[0], D[f][1] - M[1], D[f][2] - M[2]) < 1e-6) return f;
          return D.push([
            M[0],
            M[1],
            M[2]
          ]), D.length - 1;
        }, c = (M) => {
          const f = D[M[0]], L = D[M[1]];
          return [
            Math.min(f[0], L[0]),
            Math.min(f[1], L[1]),
            Math.min(f[2], L[2]),
            Math.max(f[0], L[0]),
            Math.max(f[1], L[1]),
            Math.max(f[2], L[2])
          ];
        };
        let g = 0;
        for (let M = 0; M < k.length; M++) {
          if (k[M].length !== 2) continue;
          const f = c(k[M]);
          for (let L = M + 1; L < k.length; L++) {
            if (k[L].length !== 2) continue;
            const [$, b] = k[M], [v, y] = k[L];
            if ($ === v || $ === y || b === v || b === y) continue;
            const T = c(k[L]);
            if (f[0] > T[3] + 1e-6 || T[0] > f[3] + 1e-6 || f[1] > T[4] + 1e-6 || T[1] > f[4] + 1e-6 || f[2] > T[5] + 1e-6 || T[2] > f[5] + 1e-6) continue;
            const C = D[$], z = D[b], w = D[v], S = D[y], _ = [
              z[0] - C[0],
              z[1] - C[1],
              z[2] - C[2]
            ], X = [
              S[0] - w[0],
              S[1] - w[1],
              S[2] - w[2]
            ], K = [
              C[0] - w[0],
              C[1] - w[1],
              C[2] - w[2]
            ], ge = s(_, _), $e = s(_, X), Ae = s(X, X), We = s(_, K), _e = s(X, K), De = ge * Ae - $e * $e;
            if (De < 1e-10 * ge * Ae) continue;
            const Ie = ($e * _e - Ae * We) / De, ve = (ge * _e - $e * We) / De;
            if (Ie < 1e-6 || Ie > 1 - 1e-6 || ve < 1e-6 || ve > 1 - 1e-6) continue;
            const Ee = [
              C[0] + Ie * _[0],
              C[1] + Ie * _[1],
              C[2] + Ie * _[2]
            ], ze = [
              w[0] + ve * X[0],
              w[1] + ve * X[1],
              w[2] + ve * X[2]
            ];
            if (Math.hypot(Ee[0] - ze[0], Ee[1] - ze[1], Ee[2] - ze[2]) > 1e-6) continue;
            const Xe = n(Ee);
            for (const be of [
              M,
              L
            ]) {
              const [Ge, Ye] = k[be], Oe = k.length;
              k[be] = [
                Ge,
                Xe
              ], k.push([
                Xe,
                Ye
              ]), p(be, Oe);
              const Te = I.get(be);
              Te && (I.set(be, [
                ...Te.slice(0, 6),
                ...Array(6).fill(false)
              ]), I.set(Oe, [
                ...Array(6).fill(false),
                ...Te.slice(6)
              ]));
              const xe = R.get(be);
              xe && (R.set(be, [
                xe[0],
                0,
                xe[2]
              ]), R.set(Oe, [
                0,
                xe[1],
                xe[2]
              ]));
            }
            g++;
          }
        }
        g > 0 && console.log(`[CLI Modeler] ${g} cruces de barras partidos con nudo (como ETABS; meshcross 0 lo apaga)`);
      }
      for (const s of d.shells) {
        const l = s.pts.map((g) => A.get(g));
        if (l.some((g) => g === void 0)) {
          d.errors.push(`shell ${s.id}: algun nodo inexistente`);
          continue;
        }
        const p = k.length;
        q.set(s.id, p), k.push(l), o.set(p, s.E), N.set(p, s.E / (2 * 1.2)), se.set(p, s.t), h.set(p, s.rho ?? 2.45), G.set(p, 0.2);
        const n = d.shellTypes.get(s.id);
        n !== void 0 && P.set(p, n);
        const c = d.deckSecs.get(s.id);
        if (c) {
          const g = c.tc + (c.sr > 0 ? c.hr * (c.wrt + c.wrb) / 2 / c.sr : 0);
          se.set(p, c.tc), h.set(p, ((s.rho ?? 2.45) * g + c.w / 9.80665) / c.tc), Z.set(p, {
            ...c
          });
        }
      }
      const ne = /* @__PURE__ */ new Map();
      for (const [s, l] of d.supports.entries()) {
        const p = A.get(s);
        p !== void 0 && ne.set(p, l);
      }
      const W = /* @__PURE__ */ new Map();
      for (const [s, l] of d.loads.entries()) {
        const p = A.get(s);
        p !== void 0 && W.set(p, [
          ...l
        ]);
      }
      const ue = /* @__PURE__ */ new Map();
      for (const [s, l] of d.diaphragms.entries()) {
        const p = A.get(s);
        p !== void 0 && ue.set(p, l);
      }
      const le = /* @__PURE__ */ new Map();
      for (const [s, l] of d.masses.entries()) {
        const p = A.get(s);
        p !== void 0 && le.set(p, l);
      }
      const H = /* @__PURE__ */ new Map();
      for (const [s, l] of d.loadsPat) {
        const p = /* @__PURE__ */ new Map();
        for (const [n, c] of l) {
          const g = A.get(n);
          g !== void 0 && p.set(g, [
            ...c
          ]);
        }
        H.set(s, p);
      }
      const Me = {
        Dead: new Map([
          ...W
        ].map(([s, l]) => [
          s,
          [
            ...l
          ]
        ]))
      };
      for (const [s, l] of H) Me[s] = new Map([
        ...l
      ].map(([p, n]) => [
        p,
        [
          ...n
        ]
      ]));
      const we = [
        [
          d.frameLoads,
          W
        ]
      ];
      for (const [s, l] of d.frameLoadsPat) H.has(s) || H.set(s, /* @__PURE__ */ new Map()), we.push([
        l,
        H.get(s)
      ]);
      for (const [s, l] of we) if (s.size) {
        const p = (n, c) => {
          const g = l.get(n) ?? [
            0,
            0,
            0,
            0,
            0,
            0
          ];
          l.set(n, [
            g[0] + c[0],
            g[1] + c[1],
            g[2] + c[2],
            g[3] + c[3],
            g[4] + c[4],
            g[5] + c[5]
          ]);
        };
        for (const [n, c] of s.entries()) {
          const g = d.frames.find((z) => z.id === n);
          if (!g) {
            d.errors.push(`frameload ${n}: no existe esa barra`);
            continue;
          }
          const M = A.get(g.nI), f = A.get(g.nJ);
          if (M === void 0 || f === void 0) continue;
          const L = D[M], $ = D[f], b = [
            $[0] - L[0],
            $[1] - L[1],
            $[2] - L[2]
          ], v = Math.hypot(b[0], b[1], b[2]);
          if (v < 1e-9) continue;
          const y = [
            b[0] / v,
            b[1] / v,
            b[2] / v
          ], T = v * v / 12, C = [
            y[1] * c[2] - y[2] * c[1],
            y[2] * c[0] - y[0] * c[2],
            y[0] * c[1] - y[1] * c[0]
          ];
          p(M, [
            c[0] * v / 2,
            c[1] * v / 2,
            c[2] * v / 2,
            T * C[0],
            T * C[1],
            T * C[2]
          ]), p(f, [
            c[0] * v / 2,
            c[1] * v / 2,
            c[2] * v / 2,
            -T * C[0],
            -T * C[1],
            -T * C[2]
          ]);
        }
      }
      const de = /* @__PURE__ */ new Map(), ce = (s, l) => {
        const p = 1 / Math.sqrt(3), n = [
          [
            -p,
            -p
          ],
          [
            p,
            -p
          ],
          [
            p,
            p
          ],
          [
            -p,
            p
          ]
        ], c = [
          0,
          0,
          0,
          0
        ];
        for (const [g, M] of n) {
          const f = [
            0.25 * (1 - g) * (1 - M),
            0.25 * (1 + g) * (1 - M),
            0.25 * (1 + g) * (1 + M),
            0.25 * (1 - g) * (1 + M)
          ], L = [
            -0.25 * (1 - M),
            0.25 * (1 - M),
            0.25 * (1 + M),
            -0.25 * (1 + M)
          ], $ = [
            -0.25 * (1 - g),
            -0.25 * (1 + g),
            0.25 * (1 + g),
            0.25 * (1 - g)
          ], b = [
            0,
            1,
            2
          ].map((C) => L.reduce((z, w, S) => z + w * s[S][C], 0)), v = [
            0,
            1,
            2
          ].map((C) => $.reduce((z, w, S) => z + w * s[S][C], 0)), y = [
            b[1] * v[2] - b[2] * v[1],
            b[2] * v[0] - b[0] * v[2],
            b[0] * v[1] - b[1] * v[0]
          ], T = Math.hypot(y[0], y[1], y[2]);
          for (let C = 0; C < 4; C++) c[C] += f[C] * l * T;
        }
        return c;
      }, ke = (s, l) => {
        const p = s.pts.map((c) => A.get(c));
        if (p.some((c) => c === void 0)) return null;
        const n = p.map((c) => D[c]);
        return {
          idx: p,
          f: ce(n, l)
        };
      };
      for (const s of d.shells) {
        const l = d.shellLoads.get(s.id);
        if (!l || d.deckTributario.has(s.id)) continue;
        const p = ke(s, l);
        if (!p) {
          d.errors.push(`areaload ${s.id}: algun nodo inexistente`);
          continue;
        }
        for (let n = 0; n < 4; n++) {
          const c = p.idx[n], g = W.get(c) ?? [
            0,
            0,
            0,
            0,
            0,
            0
          ];
          g[2] += p.f[n], W.set(c, g), de.set(c, (de.get(c) ?? 0) + p.f[n]);
        }
      }
      for (const [s, l] of d.shellLoadsPat) {
        H.has(s) || H.set(s, /* @__PURE__ */ new Map());
        const p = H.get(s);
        for (const [n, c] of l) {
          const g = d.shells.find((f) => f.id === n);
          if (!g || !c) continue;
          const M = ke(g, c);
          if (!M) {
            d.errors.push(`areaload ${n} ${s}: algun nodo inexistente`);
            continue;
          }
          for (let f = 0; f < 4; f++) {
            const L = M.idx[f], $ = p.get(L) ?? [
              0,
              0,
              0,
              0,
              0,
              0
            ];
            $[2] += M.f[f], p.set(L, $);
          }
        }
      }
      if (d.selfWeight) {
        const l = /* @__PURE__ */ new Set();
        for (const [n, c] of q) d.deckTributario.has(n) && l.add(c);
        const p = (n, c) => {
          const g = W.get(n) ?? [
            0,
            0,
            0,
            0,
            0,
            0
          ];
          g[2] += c, W.set(n, g);
        };
        k.forEach((n, c) => {
          const g = h.get(c) ?? 0;
          if (g && !l.has(c)) {
            if (n.length === 2) {
              const M = e.get(c) ?? 0, f = D[n[0]], L = D[n[1]], $ = [
                L[0] - f[0],
                L[1] - f[1],
                L[2] - f[2]
              ];
              let b = Math.hypot($[0], $[1], $[2]);
              const v = R.get(c);
              if (v) {
                const _ = Math.hypot($[0], $[1]);
                _ > 1e-9 && Math.abs(Math.atan2(Math.abs($[2]), _)) * 180 / Math.PI < 20 && (b = Math.max(b - v[0] - v[1], 0));
              }
              const y = Math.hypot($[0], $[1], $[2]), T = -M * g * 9.80665 * d.selfWeight, C = [
                $[0] / y,
                $[1] / y,
                $[2] / y
              ], z = b * b / 12, w = [
                C[1] * T,
                -C[0] * T,
                0
              ], S = (_, X) => {
                const K = W.get(_) ?? [
                  0,
                  0,
                  0,
                  0,
                  0,
                  0
                ];
                W.set(_, [
                  K[0] + X[0],
                  K[1] + X[1],
                  K[2] + X[2],
                  K[3] + X[3],
                  K[4] + X[4],
                  K[5] + X[5]
                ]);
              };
              S(n[0], [
                0,
                0,
                T * b / 2,
                z * w[0],
                z * w[1],
                0
              ]), S(n[1], [
                0,
                0,
                T * b / 2,
                -z * w[0],
                -z * w[1],
                0
              ]);
            } else if (n.length === 4) {
              const M = se.get(c) ?? 0, f = n.map((b) => D[b]);
              let L = 0;
              for (let b = 1; b < 3; b++) {
                const v = [
                  f[b][0] - f[0][0],
                  f[b][1] - f[0][1],
                  f[b][2] - f[0][2]
                ], y = [
                  f[b + 1][0] - f[0][0],
                  f[b + 1][1] - f[0][1],
                  f[b + 1][2] - f[0][2]
                ], T = [
                  v[1] * y[2] - v[2] * y[1],
                  v[2] * y[0] - v[0] * y[2],
                  v[0] * y[1] - v[1] * y[0]
                ];
                L += Math.hypot(T[0], T[1], T[2]) / 2;
              }
              const $ = L * M * g * 9.80665 * d.selfWeight;
              for (const b of n) p(b, -$ / 4);
            }
          }
        });
      }
      const te = [];
      for (const s of d.springs) {
        const l = A.get(s.node);
        l !== void 0 && te.push({
          node: l,
          dof: s.dof,
          k: s.k
        });
      }
      for (const s of d.areaSprings) {
        const l = q.get(s.id);
        if (l === void 0) {
          d.errors.push(`areaspring ${s.id}: no existe esa cascara`);
          continue;
        }
        te.push({
          node: -(l + 1),
          dof: s.nodal ? -3 : -1,
          k: s.ks
        });
      }
      if (d.edgeEtabs) {
        const s = d.edgeLineal, l = s ? 1e-4 : 1e-6, p = /* @__PURE__ */ new Set(), n = [];
        k.forEach((g, M) => {
          if (g.length === 3 || g.length === 4) {
            n.push(M);
            for (const f of g) p.add(f);
          }
        });
        let c = 0;
        for (const g of n) {
          const M = k[g], f = M.map(($) => D[$]), L = [
            0,
            1,
            2
          ].map(($) => [
            Math.min(...f.map((b) => b[$])),
            Math.max(...f.map((b) => b[$]))
          ]);
          for (let $ = 0; $ < D.length; $++) {
            if (M.includes($)) continue;
            const b = D[$], v = s ? l * Math.max(L[0][1] - L[0][0], L[1][1] - L[1][0], L[2][1] - L[2][0]) : 1e-6;
            if (b[0] < L[0][0] - v || b[0] > L[0][1] + v || b[1] < L[1][0] - v || b[1] > L[1][1] + v || b[2] < L[2][0] - v || b[2] > L[2][1] + v) continue;
            let y = false;
            for (let C = 0; C < M.length && !y; C++) {
              const z = f[C], w = f[(C + 1) % M.length], S = [
                w[0] - z[0],
                w[1] - z[1],
                w[2] - z[2]
              ], _ = S[0] * S[0] + S[1] * S[1] + S[2] * S[2];
              if (_ < 1e-24) continue;
              const X = [
                b[0] - z[0],
                b[1] - z[1],
                b[2] - z[2]
              ], K = (X[0] * S[0] + X[1] * S[1] + X[2] * S[2]) / _;
              if (K <= 1e-6 || K >= 1 - 1e-6) continue;
              const ge = [
                X[0] - K * S[0],
                X[1] - K * S[1],
                X[2] - K * S[2]
              ];
              Math.hypot(ge[0], ge[1], ge[2]) <= l * Math.sqrt(_) && (y = true);
            }
            !y || !(s || k.some((C, z) => z !== g && C.includes($))) || (te.push({
              node: -(g + 1),
              dof: s ? -4 : -2,
              k: $
            }), c++);
          }
        }
        c && console.log(`[CLI Modeler] edge ${s ? "lineal" : "etabs"}: ${c} nudo(s) colgado(s) atado(s) a su arista (${s ? "lineal" : "Hermite"})`);
      }
      const ee = [];
      for (const s of d.solids) {
        const l = s.pts.map((n) => A.get(n));
        if (l.some((n) => n === void 0)) {
          d.errors.push(`hex ${s.id}: algun nodo inexistente`);
          continue;
        }
        const p = k.length;
        if (k.push(l), o.set(p, s.E), G.set(p, s.nu), N.set(p, s.E / (2 * (1 + s.nu))), h.set(p, s.rho), ee.push(p), d.selfWeight && s.rho) {
          const n = l.map((f) => D[f]), c = (f, L, $, b) => {
            const v = [
              0,
              1,
              2
            ].map((C) => n[L][C] - n[f][C]), y = [
              0,
              1,
              2
            ].map((C) => n[$][C] - n[f][C]), T = [
              0,
              1,
              2
            ].map((C) => n[b][C] - n[f][C]);
            return Math.abs(v[0] * (y[1] * T[2] - y[2] * T[1]) - v[1] * (y[0] * T[2] - y[2] * T[0]) + v[2] * (y[0] * T[1] - y[1] * T[0])) / 6;
          }, M = (c(0, 1, 2, 6) + c(0, 2, 3, 6) + c(0, 3, 7, 6) + c(0, 7, 4, 6) + c(0, 4, 5, 6) + c(0, 5, 1, 6)) * s.rho * 9.80665 * d.selfWeight;
          for (const f of l) {
            const L = W.get(f) ?? [
              0,
              0,
              0,
              0,
              0,
              0
            ];
            L[2] -= M / 8, W.set(f, L);
          }
        }
      }
      const fe = /* @__PURE__ */ new Set();
      for (const s of k) for (const l of s) fe.add(l);
      for (const [s] of ne) fe.add(s);
      for (const s of te) s.node >= 0 ? fe.add(s.node) : (s.dof === -2 || s.dof === -4) && fe.add(s.k);
      const me = (s) => U[s] ?? s, Le = {
        Dead: W,
        ...Object.fromEntries(H)
      }, ae = /* @__PURE__ */ new Set(), oe = {};
      for (const [s, l] of Object.entries(Le)) for (const [p, n] of l) {
        if (fe.has(p) || !n.some((g) => Math.abs(g) > 1e-9)) continue;
        ae.add(p);
        const c = oe[s] ?? (oe[s] = [
          0,
          0,
          0
        ]);
        c[0] += n[0], c[1] += n[1], c[2] += n[2];
      }
      let ie = null, pe = null;
      if (ae.size) {
        const s = [
          ...ae
        ].map(me).sort((n, c) => n - c).join(", "), l = Object.entries(oe).map(([n, c]) => `${n} ${c[2].toFixed(0)} kN`).join(", "), p = Object.values(oe).reduce((n, c) => n + Math.abs(c[2]), 0);
        ie = `${ae.size} carga(s) en nudos SIN RIGIDEZ [${s}]: ${p.toFixed(0)} kN se perder\xEDan sin avisar (${l})`, d.errors.push(ie), console.warn("[CLI Modeler] \u26A0", ie);
      }
      window.__hekatanCliNudosSinRigidez = ae.size ? {
        nudos: [
          ...ae
        ].map(me),
        perdidaPorPatron: oe,
        mensaje: ie
      } : null, t.nodes.val = D, t.elements.val = k, t.nodeInputs.val = {
        supports: ne,
        loads: W,
        masses: le,
        diaphragms: ue,
        cargasPorPatron: Me,
        springs: te
      }, t.springs && (t.springs.val = te);
      const Y = /* @__PURE__ */ new Map(), Ce = /* @__PURE__ */ new Map(), je = /* @__PURE__ */ new Map(), Re = /* @__PURE__ */ new Map(), Je = /* @__PURE__ */ new Map();
      for (const s of d.shells) {
        const l = q.get(s.id);
        if (l === void 0) continue;
        const p = d.shellLoads.get(s.id);
        p !== void 0 && Re.set(l, p);
        const n = d.shellAngles.get(s.id);
        n !== void 0 && Je.set(l, n);
        const c = d.shellModsDir.get(s.id);
        if (c) {
          je.set(l, c), Y.set(l, (c[0] + c[1]) / 2), Ce.set(l, (c[3] + c[4]) / 2);
          continue;
        }
        const g = d.shellMods.get(s.id);
        g ? (Y.set(l, g[0]), Ce.set(l, g[1])) : d.deckSecs.has(s.id) && (Y.set(l, 1), Ce.set(l, 0));
      }
      if (t.elementInputs.val = {
        elasticities: o,
        shearModuli: N,
        areas: e,
        momentsOfInertiaY: a,
        momentsOfInertiaZ: i,
        torsionalConstants: d.torsionFactor !== 1 ? new Map([
          ...r
        ].map(([s, l]) => [
          s,
          l * d.torsionFactor
        ])) : r,
        densities: h,
        poissonsRatios: G,
        thicknesses: se,
        membraneModifiers: Y,
        bendingModifiers: Ce,
        shellModifiers: je,
        shellSurfaceLoads: Re,
        shellAngles: Je,
        cargaDeArea: de,
        cantos: F,
        anchos: x,
        sectionShapes: m,
        localAngles: E,
        shearAreasY: J,
        shearAreasZ: B,
        momentReleases: I,
        endOffsets: R,
        plateFormulations: P,
        deckSections: Z,
        frameLoads: j,
        frameLoadsPorPatron: (() => {
          const s = {
            Dead: j
          }, l = /* @__PURE__ */ new Map();
          k.forEach((p, n) => {
            if (p.length === 2) {
              const c = d.frames.find((g) => A.get(g.nI) === p[0] && A.get(g.nJ) === p[1]);
              c && l.set(c.id, n);
            }
          });
          for (const [p, n] of d.frameLoadsPat) {
            const c = /* @__PURE__ */ new Map();
            for (const [g, M] of n) {
              const f = l.get(g);
              f !== void 0 && c.set(f, M);
            }
            s[p] = c;
          }
          return s;
        })(),
        combos: d.combos,
        fcExport: d.fc,
        areaSpringsExport: new Map(d.areaSprings.map((s) => [
          q.get(s.id),
          {
            ks: s.ks,
            nodal: s.nodal,
            comp: !!s.comp
          }
        ]).filter(([s]) => s !== void 0)),
        meshAtIntersections: d.meshCross,
        solidIncompatible: d.solidIncompatible,
        selfWeight: d.selfWeight,
        etabsWallJoint: d.etabsWallJoint,
        areaObjects: d.areaObjs.map((s) => ({
          nodes: s.pts.map((l) => A.get(l)).filter((l) => l !== void 0),
          cells: s.cells.map((l) => q.get(l)).filter((l) => l !== void 0),
          q: s.cells.map((l) => d.shellLoads.get(l)).find((l) => l !== void 0),
          ang: s.cells.map((l) => d.shellAngles.get(l)).find((l) => l !== void 0)
        })).filter((s) => s.nodes.length === 4 && s.cells.length > 0)
      }, d.doSolve && ee.length > 0 && ee.length === k.length && te.length === 0) try {
        const s = o.get(ee[0]) ?? 25e6, l = G.get(ee[0]) ?? 0.2;
        ee.some((M) => Math.abs((o.get(M) ?? s) - s) > 1e-9 * s || Math.abs((G.get(M) ?? l) - l) > 1e-12) && d.errors.push("hex: hex8Solve lleva UN material; los solidos tienen E o nu distintos y se usa el del primero");
        const p = /* @__PURE__ */ new Map();
        for (const [M, f] of t.nodeInputs.val.supports ?? []) p.set(M, [
          !!f[0],
          !!f[1],
          !!f[2]
        ]);
        const n = /* @__PURE__ */ new Map();
        for (const [M, f] of qe({
          Dead: W,
          ...Object.fromEntries(H)
        })) n.set(M, [
          f[0] ?? 0,
          f[1] ?? 0,
          f[2] ?? 0
        ]);
        const c = ss({
          nodes: D,
          elements: k,
          E: s,
          nu: l,
          supports: p,
          loads: n,
          incompatible: d.solidIncompatible
        }), g = /* @__PURE__ */ new Map();
        c.displacements.forEach(([M, f, L], $) => g.set($, [
          M,
          f,
          L,
          0,
          0,
          0
        ])), t.deformOutputs.val = {
          deformations: g,
          reactions: /* @__PURE__ */ new Map()
        }, t.analyzeOutputs.val = {
          solidStress: c.stressPerElement,
          solidVonMises: c.vonMisesPerElement
        }, console.log(`[CLI Modeler] Solve OK \u2014 ${k.length} solidos H8, ${D.length} nodos (${c.elapsedMs.toFixed(0)} ms)`);
      } catch (s) {
        d.errors.push(`hex8Solve: ${(s == null ? void 0 : s.message) ?? s}`);
      }
      else if (d.doSolve && D.length && k.length) try {
        window.__hekatanCliSprings = te;
        const s = qe({
          Dead: W,
          ...Object.fromEntries(H)
        });
        t.deformOutputs.val = as(D, k, {
          ...t.nodeInputs.val,
          loads: s
        }, t.elementInputs.val, te.length ? te : void 0);
        try {
          t.analyzeOutputs.val = os(D, k, t.elementInputs.val, t.deformOutputs.val);
        } catch (l) {
          console.warn("[CLI Modeler] analyze:", (l == null ? void 0 : l.message) ?? l);
        }
        if (d.areaSprings.length > 0) try {
          const l = t.deformOutputs.val.deformations, p = t.analyzeOutputs.val ?? {}, n = p.pressure instanceof Map ? p.pressure : /* @__PURE__ */ new Map();
          let c = 0, g = 0;
          for (const M of d.areaSprings) {
            const f = q.get(M.id);
            if (f === void 0) continue;
            const $ = k[f].map((b) => {
              var _a2;
              const v = ((_a2 = l.get(b)) == null ? void 0 : _a2[2]) ?? 0, y = M.ks * v;
              return y < c && (c = y), y > g && (g = y), y;
            });
            n.set(f, $);
          }
          n.size > 0 && (p.pressure = n, p.colorMapRanges = {
            ...p.colorMapRanges ?? {},
            pressure: [
              g,
              c
            ]
          }, t.analyzeOutputs.val = p, console.log(`[CLI Modeler] presi\xF3n Winkler: ${n.size} shells, \u03C3 ${c.toFixed(0)}..${g.toFixed(0)} kN/m\xB2`));
        } catch (l) {
          console.warn("[CLI Modeler] presi\xF3n:", (l == null ? void 0 : l.message) ?? l);
        }
        if (ee.length > 0) try {
          const l = t.deformOutputs.val.deformations, p = /* @__PURE__ */ new Map(), n = /* @__PURE__ */ new Map();
          for (const c of ee) {
            const g = k[c], M = g.map(($) => D[$]), f = g.flatMap(($) => {
              const b = l.get($) ?? [
                0,
                0,
                0
              ];
              return [
                b[0],
                b[1],
                b[2]
              ];
            }), L = ts(M, o.get(c) ?? 25e6, G.get(c) ?? 0.2, f, d.solidIncompatible);
            p.set(c, L.stress), n.set(c, L.vonMises);
          }
          t.analyzeOutputs.val = {
            ...t.analyzeOutputs.val ?? {},
            solidStress: p,
            solidVonMises: n
          };
        } catch (l) {
          console.warn("[CLI Modeler] tensiones de solidos:", (l == null ? void 0 : l.message) ?? l);
        }
        try {
          let l = 0;
          for (const f of s.values()) l += f[2];
          let p = 0;
          for (const f of ((_a = t.deformOutputs.val.reactions) == null ? void 0 : _a.values()) ?? []) p += f[2];
          const n = t.deformOutputs.val.deformations;
          for (const f of te) f.node >= 0 && f.dof === 2 && (p += -f.k * (((_b = n == null ? void 0 : n.get(f.node)) == null ? void 0 : _b[2]) ?? 0));
          for (const f of d.areaSprings) {
            const L = q.get(f.id);
            if (L === void 0) continue;
            const $ = k[L], b = ce($.map((v) => D[v]), 1);
            $.forEach((v, y) => {
              var _a2;
              p += -f.ks * (((_a2 = n == null ? void 0 : n.get(v)) == null ? void 0 : _a2[2]) ?? 0) * b[y];
            });
          }
          const c = l + p, g = Math.max(Math.abs(l), Math.abs(p), 1e-6), M = Math.abs(c) / g * 100;
          window.__hekatanCliEquilibrio = {
            sumCargasFz: +l.toFixed(3),
            sumReaccionesFz: +(-p).toFixed(3),
            pctErr: +M.toFixed(4)
          }, M > 0.1 && (pe = `Equilibrio: \u03A3cargasFz ${l.toFixed(1)} kN vs \u03A3reaccionesFz ${(-p).toFixed(1)} kN \u2014 difieren ${M.toFixed(2)} % (> 0.1 %)`, d.errors.push(pe), console.warn("[CLI Modeler] \u26A0", pe));
        } catch (l) {
          console.warn("[CLI Modeler] equilibrio:", (l == null ? void 0 : l.message) ?? l);
        }
        console.log("[CLI Modeler] Solve OK \u2014", k.length, "elementos,", D.length, "nodos");
      } catch (s) {
        d.errors.push(`solve fall\xF3: ${s.message}`);
      }
      if (t.objects3D.val = [], d.errors.length) {
        console.warn("[CLI Modeler] Errores:");
        for (const s of d.errors) console.warn("  -", s);
      }
      window.__hekatanCliErrors = d.errors;
      let Se = 0, Pe = 0;
      const ye = t.deformOutputs.val;
      if ((_c = ye == null ? void 0 : ye.deformations) == null ? void 0 : _c.size) for (const [, s] of ye.deformations) Math.abs(s[2]) > Math.abs(Se) && (Se = s[2]);
      if ((_d = ye == null ? void 0 : ye.reactions) == null ? void 0 : _d.size) for (const [, s] of ye.reactions) Pe += s[2] || 0;
      window.__hekatanCliVista = d.vista ?? null, window.__hekatanCliStats = {
        nodes: D.length,
        frames: d.frames.length,
        shells: d.shells.length,
        supports: ne.size,
        loads: W.size,
        springs: te.length,
        solved: d.doSolve,
        errors: d.errors.length,
        maxUzMm: +(Se * 1e3).toFixed(3),
        sumRz: +Pe.toFixed(1)
      }, rs([
        ie,
        pe
      ].filter((s) => !!s));
    }
  };
});
export {
  __tla,
  Ms as c,
  cs as p
};
