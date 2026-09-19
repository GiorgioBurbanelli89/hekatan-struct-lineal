import { g as es, f as ss, e as ts, d as os, b as ns, a as as } from "./cadSections-CEHEfdGW.js";
import { c as Ye } from "./cargasPorCaso-B_GZ_-rO.js";
import { h as is, a as rs, __tla as __tla_0 } from "./h8-Dq5Es-cV.js";
import { a as cs, __tla as __tla_1 } from "./analyze-BXz6yiS1.js";
import { m as ls, d as ds, __tla as __tla_2 } from "./didacticCpp-Czy7NlhT.js";
let xs, us;
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
  function fs(d, o, A, r = 60, x) {
    let T = A.map(() => true);
    const L = [], q = /* @__PURE__ */ new Set();
    let w, n = [];
    for (let O = 1; O <= r; O++) {
      const s = T.filter(Boolean).length;
      if (L.push(s), A.length && s === 0) return {
        deformOutputs: w,
        activo: T,
        springsFinales: n,
        iteraciones: O,
        historial: L,
        convergio: false,
        mensaje: "todos los muelles en tracci\xF3n: la zapata vuelca (e \u2265 L/2), no hay equilibrio"
      };
      n = o.concat(A.filter((h, F) => T[F])), w = d(n), x == null ? void 0 : x(O, w, T);
      const a = w.deformations, i = A.map((h) => {
        var _a;
        return (((_a = a == null ? void 0 : a.get(h.node)) == null ? void 0 : _a[h.dof]) ?? 0) < 0;
      });
      if (i.every((h, F) => h === T[F])) return {
        deformOutputs: w,
        activo: T,
        springsFinales: n,
        iteraciones: O,
        historial: L,
        convergio: true
      };
      const l = i.map((h) => h ? 1 : 0).join("");
      if (q.has(l)) return {
        deformOutputs: w,
        activo: T,
        springsFinales: n,
        iteraciones: O,
        historial: L,
        convergio: false,
        mensaje: "el contacto oscila entre dos estados (ciclo): revisar el modelo"
      };
      q.add(l), T = i;
    }
    return {
      deformOutputs: w,
      activo: T,
      springsFinales: n,
      iteraciones: r,
      historial: L,
      convergio: false,
      mensaje: `sin converger en ${r} iteraciones`
    };
  }
  function Ve(d) {
    if (d.length === 3) {
      const r = [
        d[1][0] - d[0][0],
        d[1][1] - d[0][1],
        d[1][2] - d[0][2]
      ], x = [
        d[2][0] - d[0][0],
        d[2][1] - d[0][1],
        d[2][2] - d[0][2]
      ], T = [
        r[1] * x[2] - r[2] * x[1],
        r[2] * x[0] - r[0] * x[2],
        r[0] * x[1] - r[1] * x[0]
      ], L = 0.5 * Math.hypot(T[0], T[1], T[2]);
      return [
        L / 3,
        L / 3,
        L / 3
      ];
    }
    const o = 1 / Math.sqrt(3), A = [
      0,
      0,
      0,
      0
    ];
    for (const r of [
      -o,
      o
    ]) for (const x of [
      -o,
      o
    ]) {
      const T = [
        (1 - r) * (1 - x),
        (1 + r) * (1 - x),
        (1 + r) * (1 + x),
        (1 - r) * (1 + x)
      ].map((a) => a / 4), L = [
        -(1 - x),
        1 - x,
        1 + x,
        -(1 + x)
      ].map((a) => a / 4), q = [
        -(1 - r),
        -(1 + r),
        1 + r,
        1 - r
      ].map((a) => a / 4), w = [
        0,
        0,
        0
      ], n = [
        0,
        0,
        0
      ];
      for (let a = 0; a < 4; a++) for (let i = 0; i < 3; i++) w[i] += L[a] * d[a][i], n[i] += q[a] * d[a][i];
      const O = [
        w[1] * n[2] - w[2] * n[1],
        w[2] * n[0] - w[0] * n[2],
        w[0] * n[1] - w[1] * n[0]
      ], s = Math.hypot(O[0], O[1], O[2]);
      for (let a = 0; a < 4; a++) A[a] += T[a] * s;
    }
    return A;
  }
  const ps = false;
  function hs(d) {
    if (typeof document > "u") return;
    const o = "hk-banner-sin-rigidez";
    let A = document.getElementById(o);
    if (!d.length) {
      A == null ? void 0 : A.remove();
      return;
    }
    A || (A = document.createElement("div"), A.id = o, A.style.cssText = "position:fixed;top:8px;left:50%;transform:translateX(-50%);z-index:1000;max-width:90vw;background:#7a1414;color:#fff;border:2px solid #ff4d4d;border-radius:6px;padding:8px 14px;font:bold 13px sans-serif;box-shadow:0 2px 10px rgba(0,0,0,.5);white-space:pre-line", document.body.appendChild(A)), A.textContent = "\u26A0 " + d.join(`
\u26A0 `);
  }
  const Je = {
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
  function Ze(d) {
    const o = d.toLowerCase().trim();
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
    const A = [
      false,
      false,
      false,
      false,
      false,
      false
    ], r = o.split(/[\s,]+/).filter(Boolean);
    if (r.length > 1 && r.length <= 6 && r.every((x) => x === "0" || x === "1")) return r.forEach((x, T) => {
      A[T] = x === "1";
    }), A;
    for (const x of r) Je[x] !== void 0 && (A[Je[x]] = true);
    if (/^[01]+$/.test(o) && o.length <= 6) for (let x = 0; x < o.length; x++) A[x] = o[x] === "1";
    return A;
  }
  us = function(d) {
    const o = {
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
    let A = null, r = 0, x = 0, T = 0;
    const L = d.split(/\r?\n/);
    for (let q = 0; q < L.length; q++) {
      let w = L[q].trim();
      if (!w || w.startsWith("#") || w.startsWith("//")) continue;
      w = w.replace(/[;]+$/, "");
      const n = w.split(/\s+/), O = n[0].toLowerCase();
      if (O === "nodes" && n.length === 1) {
        A = "nodes";
        continue;
      }
      if ((O === "elements" || O === "frames") && n.length === 1) {
        A = "elements";
        continue;
      }
      if (O === "areas" && n.length === 1) {
        A = "areas";
        continue;
      }
      if (O === "supports" && n.length === 1) {
        A = "supports";
        continue;
      }
      if (O === "loads" && n.length === 1) {
        A = "loads";
        continue;
      }
      if (O === "springs" && n.length === 1) {
        A = "springs";
        continue;
      }
      if (A && /^[\-\d]/.test(n[0])) {
        const s = n.map(parseFloat);
        if (A === "nodes" && s.length >= 3) {
          r++, o.nodes.set(r, [
            s[0],
            s[1],
            s[2]
          ]);
          continue;
        }
        if (A === "elements" && s.length >= 2) {
          x++, o.frames.push({
            id: x,
            nI: s[0] + 1,
            nJ: s[1] + 1,
            E: 25e6,
            A: 0.16,
            I: 21e-4
          });
          continue;
        }
        if (A === "areas" && s.length >= 4) {
          T++, o.shells.push({
            id: T,
            pts: [
              s[0] + 1,
              s[1] + 1,
              s[2] + 1,
              s[3] + 1
            ],
            t: 0.2,
            E: 25e6
          });
          continue;
        }
        if (A === "loads" && s.length >= 4) {
          o.loads.set(s[0], [
            s[1] ?? 0,
            s[2] ?? 0,
            s[3] ?? 0,
            s[4] ?? 0,
            s[5] ?? 0,
            s[6] ?? 0
          ]);
          continue;
        }
        if (A === "springs" && s.length >= 3) {
          o.springs.push({
            node: s[0],
            dof: s[1],
            k: s[2]
          });
          continue;
        }
      }
      if (A === "supports" && /^\d/.test(n[0])) {
        const s = parseInt(n[0], 10), a = n.slice(1).join(" ");
        o.supports.set(s, Ze(a));
        continue;
      }
      A && !/^[\-\d]/.test(n[0]) && (A = null);
      try {
        switch (O) {
          case "node":
          case "n": {
            const s = parseInt(n[1], 10), a = parseFloat(n[2]), i = parseFloat(n[3]), l = parseFloat(n[4]);
            !isFinite(s) || !isFinite(a) || !isFinite(i) || !isFinite(l) ? o.errors.push(`L${q + 1}: node mal formado: ${w}`) : o.nodes.set(s, [
              a,
              i,
              l
            ]);
            break;
          }
          case "frame":
          case "beam":
          case "column":
          case "f": {
            const s = parseInt(n[1], 10), a = parseInt(n[2], 10), i = parseInt(n[3], 10), l = parseFloat(n[4] ?? "25e6"), h = parseFloat(n[5] ?? "0.16"), F = parseFloat(n[6] ?? "0.001"), E = n[7] !== void 0 ? parseFloat(n[7]) : void 0, b = n[8] !== void 0 ? parseFloat(n[8]) : void 0, j = n[9] !== void 0 ? parseFloat(n[9]) : void 0, C = n[10] !== void 0 ? parseFloat(n[10]) : void 0, R = n[11] !== void 0 ? parseFloat(n[11]) : void 0, W = n[12] !== void 0 ? parseFloat(n[12]) : void 0, Z = n.indexOf("#"), _ = Z >= 0 && n[Z + 1] ? n[Z + 1] : void 0;
            o.frames.push({
              id: s,
              nI: a,
              nJ: i,
              E: l,
              A: h,
              I: F,
              Iy: E,
              J: b,
              nu: j,
              rho: C,
              D: R,
              B: W,
              sec: _
            });
            break;
          }
          case "cftc": {
            const s = parseInt(n[1], 10), a = parseFloat(n[2] ?? ""), i = parseFloat(n[3] ?? ""), l = parseFloat(n[4] ?? "25e6"), h = parseFloat(n[5] ?? "0.2"), F = parseFloat(n[6] ?? "2.4");
            isFinite(s) && a > 0 && i > 0 && i < a / 2 && l > 0 ? o.frameCftc.set(s, {
              D: a,
              t: i,
              Ec: l,
              nuC: isFinite(h) ? h : 0.2,
              rhoC: isFinite(F) && F >= 0 ? F : 2.4
            }) : o.errors.push(`cftc ${n[1]}: hace falta D t (m) y Ec (kN/m2), con t < D/2`);
            break;
          }
          case "isec":
          case "perfili": {
            const s = parseInt(n[1], 10), a = n.slice(2, 8).map((j) => parseFloat(j)), [i, l, h, F] = a, E = isFinite(a[4]) ? a[4] : l, b = isFinite(a[5]) ? a[5] : h;
            isFinite(s) && i > 0 && l > 0 && h > 0 && F > 0 && E > 0 && b > 0 && h + b < i && F < Math.min(l, E) ? o.frameISec.set(s, {
              d: i,
              bf: l,
              tf: h,
              tw: F,
              t2b: E,
              tfb: b
            }) : o.errors.push(`isec ${n[1]}: hace falta d bf tf tw [t2b tfb] (m), con tf+tfb < d y tw < bf`);
            break;
          }
          case "tubo":
          case "tube": {
            const s = parseInt(n[1], 10), [a, i, l, h] = n.slice(2, 6).map((F) => parseFloat(F));
            isFinite(s) && a > 0 && i > 0 && l > 0 && h > 0 && h < a / 2 && l < i / 2 ? o.frameTube.set(s, {
              b: a,
              h: i,
              tf: l,
              tw: h
            }) : o.errors.push(`tubo ${n[1]}: hace falta b h tf tw (m), con tw < b/2 y tf < h/2`);
            break;
          }
          case "canal":
          case "channel": {
            const s = parseInt(n[1], 10), [a, i, l, h] = n.slice(2, 6).map((F) => parseFloat(F));
            isFinite(s) && a > 0 && i > 0 && l > 0 && h > 0 && 2 * l < a && h < i ? o.frameCanal.set(s, {
              d: a,
              bf: i,
              tf: l,
              tw: h
            }) : o.errors.push(`canal ${n[1]}: hace falta d bf tf tw (m), con 2\xB7tf < d y tw < bf`);
            break;
          }
          case "dosl":
          case "2l": {
            const s = parseInt(n[1], 10), [a, i, l, h, F] = n.slice(2, 7).map((b) => parseFloat(b)), E = (i - (F || 0)) / 2;
            isFinite(s) && a > 0 && i > 0 && l > 0 && h > 0 && F >= 0 && E > h && l < a ? o.frameDosL.set(s, {
              d: a,
              t2: i,
              tf: l,
              tw: h,
              dis: F
            }) : o.errors.push(`dosl ${n[1]}: hace falta d t2 tf tw dis (m), con (t2 \u2212 dis)/2 > tw`);
            break;
          }
          case "cft": {
            const s = parseInt(n[1], 10), a = n.slice(2).map((W) => parseFloat(W)), i = a.length >= 5 && a[3] < 1 && a[4] >= 1, l = a[0], h = a[1], F = a[2], E = i ? a[3] : a[2], b = i ? 4 : 3, j = isFinite(a[b]) ? a[b] : 25e6, C = isFinite(a[b + 1]) ? a[b + 1] : 0.2, R = isFinite(a[b + 2]) ? a[b + 2] : 2.4;
            isFinite(s) && l > 0 && h > 0 && F > 0 && E > 0 && E < l / 2 && F < h / 2 && j > 0 ? o.frameCft.set(s, {
              b: l,
              h,
              t: F,
              tw: E,
              Ec: j,
              nuC: C,
              rhoC: R >= 0 ? R : 2.4
            }) : o.errors.push(`cft ${n[1]}: hace falta b h t [tw] (m) y Ec (kN/m2), con tw < b/2 y t < h/2`);
            break;
          }
          case "as":
          case "shearareas": {
            const s = parseInt(n[1], 10), a = parseFloat(n[2] ?? "0"), i = parseFloat(n[3] ?? "0");
            isFinite(s) && isFinite(a) && isFinite(i) && o.frameShearAreas.set(s, [
              a,
              i
            ]);
            break;
          }
          case "release":
          case "rel": {
            const s = parseInt(n[1], 10), a = n.slice(2).map((l) => l.toLowerCase());
            if (!isFinite(s) || a.length === 0) {
              o.errors.push('release: se esperaba "release frameID <12 bits> | pin fix"');
              break;
            }
            const i = new Array(12).fill(false);
            if (a.length === 2 && a.every((l) => /^(pin|fix|libre|rigido)$/.test(l))) a.forEach((l, h) => {
              (l === "pin" || l === "libre") && (i[h * 6 + 4] = true, i[h * 6 + 5] = true);
            });
            else {
              const l = a.filter((h) => h === "0" || h === "1");
              if (l.length !== 12) {
                o.errors.push(`release ${s}: hacen falta 12 banderas (U1 U2 U3 R1 R2 R3 en I y en J), llegaron ${l.length}`);
                break;
              }
              for (let h = 0; h < 12; h++) i[h] = l[h] === "1";
            }
            i.some(Boolean) && o.frameReleases.set(s, i);
            break;
          }
          case "hex":
          case "solid":
          case "h8": {
            const s = parseInt(n[1], 10), a = n.slice(2, 10).map((i) => parseInt(i, 10));
            if (!isFinite(s) || a.length !== 8 || a.some((i) => !isFinite(i))) {
              o.errors.push(`hex ${n[1]}: hacen falta 8 nudos`);
              break;
            }
            o.solids.push({
              id: s,
              pts: a,
              E: parseFloat(n[10] ?? "25e6"),
              nu: parseFloat(n[11] ?? "0.2"),
              rho: parseFloat(n[12] ?? "2.45")
            });
            break;
          }
          case "incompatible": {
            const s = (n[1] ?? "1").toLowerCase();
            o.solidIncompatible = !(s === "0" || s === "no" || s === "off" || s === "false");
            break;
          }
          case "torsion":
          case "jmod": {
            const s = (n[1] ?? "safe").toLowerCase(), a = s === "safe" ? 0.1 : parseFloat(s);
            o.torsionFactor = isFinite(a) && a > 0 ? a : 1;
            break;
          }
          case "decksec": {
            const s = parseInt(n[1], 10), a = n.slice(2).map(parseFloat);
            if (!isFinite(s) || a.length < 5 || a.slice(0, 5).some((i) => !isFinite(i) || i < 0) || !(a[0] > 0)) {
              o.errors.push(`decksec ${n[1]}: se esperaba ID tc hr wrt wrb sr [w]`);
              break;
            }
            o.deckSecs.set(s, {
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
            const s = (n[1] ?? "etabs").toLowerCase();
            o.deckEtabs = s === "etabs" || s === "1" || s === "on" || s === "si", o.deckOneWay = n.slice(2).some((a) => /^(oneway|1way|unidireccional)$/i.test(a));
            break;
          }
          case "areaspring":
          case "winkler":
          case "springarea":
          case "winklerarea": {
            const s = parseInt(n[1], 10), a = parseFloat(n[2] ?? "0"), i = n.slice(3).some((h) => /^(nodal|lumped|sap|etabs)$/i.test(h)), l = n.slice(3).some((h) => /^(compresion|compression|compressiononly|solocompresion)$/i.test(h));
            isFinite(s) && isFinite(a) && a !== 0 ? o.areaSprings.push({
              id: s,
              ks: a,
              nodal: i,
              comp: l
            }) : o.errors.push("areaspring: uso areaspring <shellID> <ks> [nodal]");
            break;
          }
          case "edge":
          case "edgeconstraint": {
            const s = (n[1] ?? "etabs").toLowerCase();
            o.edgeEtabs = s === "etabs" || s === "1" || s === "on" || s === "si" || s === "hermite", o.edgeLineal = s === "lineal" || s === "linear" || s === "safe" || s === "sap" || s === "linea", o.edgeLineal && !ps ? (o.errors.push("edge lineal: este motor aun no lo aplica (llega con el WASM nuevo); los nudos colgados quedan sin atar"), o.edgeLineal = false) : o.edgeLineal && (o.edgeEtabs = true);
            break;
          }
          case "automesh":
          case "automallado": {
            const s = (n[1] ?? "1.25").toLowerCase();
            if (s === "off" || s === "no" || s === "0") {
              o.autoMesh = 0;
              break;
            }
            const a = parseFloat(s);
            o.autoMesh = isFinite(a) && a > 0 ? a : 1.25;
            break;
          }
          case "meshcross":
          case "meshatintersections": {
            const s = (n[1] ?? "1").toLowerCase();
            o.meshCross = !(s === "0" || s === "no" || s === "off" || s === "false");
            break;
          }
          case "etabsjoint":
          case "etabswalljoint": {
            const s = (n[1] ?? "1").toLowerCase();
            o.etabsWallJoint = !(s === "0" || s === "no" || s === "off" || s === "false");
            break;
          }
          case "selfweight":
          case "peso":
          case "sw": {
            const s = parseFloat(n[1] ?? "1");
            o.selfWeight = isFinite(s) ? s : 1;
            break;
          }
          case "endoffset":
          case "offset":
          case "lengthoff": {
            const s = parseInt(n[1], 10), a = parseFloat(n[2] ?? "0"), i = parseFloat(n[3] ?? "0"), l = parseFloat(n[4] ?? "0");
            if (!isFinite(s) || !isFinite(a) || !isFinite(i)) {
              o.errors.push('endoffset: se esperaba "endoffset frameID offI offJ [rz]"');
              break;
            }
            o.frameEndOffsets.set(s, [
              a,
              i,
              isFinite(l) ? l : 0
            ]);
            break;
          }
          case "ang":
          case "localaxis": {
            const s = parseInt(n[1], 10), a = parseFloat(n[2] ?? "0");
            isFinite(s) && isFinite(a) && o.frameAngles.set(s, a);
            break;
          }
          case "shell":
          case "plate":
          case "s": {
            const s = parseInt(n[1], 10), a = [
              parseInt(n[2], 10),
              parseInt(n[3], 10),
              parseInt(n[4], 10),
              parseInt(n[5], 10)
            ], i = parseFloat(n[6] ?? "0.20"), l = parseFloat(n[7] ?? "25e6"), h = n[9] !== void 0 ? parseFloat(n[9]) : void 0, F = h !== void 0 && isFinite(h) ? h : void 0;
            if (o.shells.push({
              id: s,
              pts: a,
              t: i,
              E: l,
              rho: F
            }), n[8] !== void 0) {
              const E = parseFloat(n[8]);
              isFinite(E) && E !== 0 && o.shellLoads.set(s, E);
            }
            break;
          }
          case "shelltype":
          case "plateform": {
            const s = parseInt(n[1], 10), a = (n[2] ?? "").toLowerCase();
            if (!isFinite(s)) break;
            let i;
            if (a === "thin" || a === "delgada" || a === "kirchhoff" || a === "1" ? i = 1 : (a === "thick" || a === "gruesa" || a === "mindlin" || a === "0") && (i = 0), i === void 0) {
              o.errors.push(`shelltype ${s}: se esperaba thin o thick`);
              break;
            }
            o.shellTypes.set(s, i);
            break;
          }
          case "shellmod": {
            const s = parseInt(n[1], 10);
            if (!isFinite(s)) break;
            const a = n.slice(2).map(parseFloat);
            if (a.length >= 8) o.shellModsDir.set(s, a.slice(0, 8).map((i) => isFinite(i) ? i : 1));
            else {
              const i = a[0], l = a[1];
              o.shellMods.set(s, [
                isFinite(i) ? i : 1,
                isFinite(l) ? l : 1
              ]);
            }
            break;
          }
          case "areaobj": {
            const s = n.slice(1).map((C) => parseInt(C, 10));
            if (s.length < 7 || s.some((C) => !isFinite(C))) {
              o.errors.push('areaobj: se esperaba "areaobj ID n1 n2 n3 n4 desdeShell hastaShell"');
              break;
            }
            const [a, i, l, h, F, E, b] = s, j = [];
            for (let C = E; C <= b; C++) j.push(C);
            o.areaObjs.push({
              id: a,
              pts: [
                i,
                l,
                h,
                F
              ],
              cells: j
            });
            break;
          }
          case "shellang": {
            const s = parseInt(n[1], 10), a = parseFloat(n[2]);
            if (!isFinite(s) || !isFinite(a)) {
              o.errors.push('shellang: se esperaba "shellang shellID grados"');
              break;
            }
            o.shellAngles.set(s, a);
            break;
          }
          case "areaload":
          case "qarea": {
            const s = parseInt(n[1], 10), a = parseFloat(n[2]);
            if (!isFinite(s) || !isFinite(a)) {
              o.errors.push('areaload: se esperaba "areaload shellID q [patron]"');
              break;
            }
            const i = n[3] && isNaN(parseFloat(n[3])) ? n[3] : "Dead";
            /^dead$/i.test(i) ? o.shellLoads.set(s, a) : (o.shellLoadsPat.has(i) || o.shellLoadsPat.set(i, /* @__PURE__ */ new Map()), o.shellLoadsPat.get(i).set(s, a));
            break;
          }
          case "support":
          case "fix": {
            const s = parseInt(n[1], 10), a = n.findIndex((l, h) => h >= 2 && l.startsWith("#")), i = n.slice(2, a < 0 ? void 0 : a).join(" ");
            o.supports.set(s, Ze(i));
            break;
          }
          case "load":
          case "l": {
            const s = parseInt(n[1], 10), a = parseFloat(n[2] ?? "0"), i = parseFloat(n[3] ?? "0"), l = parseFloat(n[4] ?? "0"), h = parseFloat(n[5] ?? "0"), F = parseFloat(n[6] ?? "0"), E = parseFloat(n[7] ?? "0"), b = n[8] && isNaN(parseFloat(n[8])) ? n[8] : "Dead";
            /^dead$/i.test(b) ? o.loads.set(s, [
              a,
              i,
              l,
              h,
              F,
              E
            ]) : (o.loadsPat.has(b) || o.loadsPat.set(b, /* @__PURE__ */ new Map()), o.loadsPat.get(b).set(s, [
              a,
              i,
              l,
              h,
              F,
              E
            ]));
            break;
          }
          case "frameload":
          case "fl": {
            const s = parseInt(n[1], 10), a = parseFloat(n[2] ?? "0"), i = parseFloat(n[3] ?? "0"), l = parseFloat(n[4] ?? "0"), h = n[5] && isNaN(parseFloat(n[5])) ? n[5] : "Dead", F = /^dead$/i.test(h) ? o.frameLoads : o.frameLoadsPat.get(h) ?? (o.frameLoadsPat.set(h, /* @__PURE__ */ new Map()), o.frameLoadsPat.get(h)), E = F.get(s) ?? [
              0,
              0,
              0
            ];
            F.set(s, [
              E[0] + a,
              E[1] + i,
              E[2] + l
            ]);
            break;
          }
          case "spring": {
            const s = parseInt(n[1], 10), a = (n[2] ?? "uz").toLowerCase(), i = Je[a] ?? 2, l = parseFloat(n[3] ?? "1000"), h = n.slice(4).some((F) => /^(compresion|compression|compressiononly|solocompresion)$/i.test(F));
            o.springs.push({
              node: s,
              dof: i,
              k: l,
              ...h ? {
                comp: true
              } : {}
            });
            break;
          }
          case "diaph":
          case "diaphragm": {
            const s = parseInt(n[1], 10), a = parseInt(n[2] ?? "1", 10);
            isFinite(s) && isFinite(a) && a > 0 && o.diaphragms.set(s, a);
            break;
          }
          case "mass": {
            const s = parseInt(n[1], 10), a = parseFloat(n[2] ?? "0");
            Number.isFinite(s) && Number.isFinite(a) ? o.masses.set(s, (o.masses.get(s) ?? 0) + a) : o.errors.push(`L${q + 1}: mass necesita <nudo> <toneladas>`);
            break;
          }
          case "vista": {
            const s = n.slice(1).filter((a) => !/^resultados?$/i.test(a));
            s[0] && (o.vista = {
              campo: s[0],
              caso: s[1]
            });
            break;
          }
          case "fc": {
            const s = parseFloat(n[1]);
            isFinite(s) && s > 0 ? o.fc = s : o.errors.push("fc: uso fc <kN/m2>");
            break;
          }
          case "combo":
          case "combinacion": {
            const s = n[1], a = [];
            for (let i = 2; i + 1 < n.length; i += 2) {
              const l = parseFloat(n[i + 1]);
              isFinite(l) && a.push([
                n[i],
                l
              ]);
            }
            s && a.length ? o.combos.push({
              name: s,
              items: a
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
            o.errors.push(`L${q + 1}: comando desconocido "${O}"`);
        }
      } catch (s) {
        o.errors.push(`L${q + 1}: error "${w}" \u2014 ${s.message}`);
      }
    }
    return o;
  };
  const ms = `# CLI Modeler \u2014 escrib\xED comandos para construir un modelo
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
`, V = (d, o) => [
    d[0] - o[0],
    d[1] - o[1],
    d[2] - o[2]
  ], pe = (d, o) => d[0] * o[0] + d[1] * o[1] + d[2] * o[2], ve = (d, o) => [
    d[1] * o[2] - d[2] * o[1],
    d[2] * o[0] - d[0] * o[2],
    d[0] * o[1] - d[1] * o[0]
  ], Q = (d) => Math.hypot(d[0], d[1], d[2]), ie = (d, o) => [
    d[0] * o,
    d[1] * o,
    d[2] * o
  ];
  function He(d, o) {
    const A = d.shellModsDir.get(o);
    return !!A && Math.abs(A[3]) < 1e-12 && Math.abs(A[4]) < 1e-12 && Math.abs(A[5]) < 1e-12;
  }
  function gs(d, o = 200, A) {
    const r = [
      0,
      1,
      2
    ].map((b) => (d[0][b] + d[1][b] + d[2][b] + d[3][b]) / 4);
    let x = V(d[1], d[0]), T = ve(x, V(d[3], d[0]));
    T = ie(T, 1 / Q(T)), x = ie(x, 1 / Q(x));
    const L = ve(T, x), q = d.map((b) => [
      pe(V(b, r), x),
      pe(V(b, r), L)
    ]);
    let w = [
      0,
      1,
      2,
      3
    ];
    if (A) {
      const b = [
        0,
        1,
        2,
        3
      ].map((j) => {
        const C = V(d[(j + 1) % 4], d[j]);
        return Math.abs(pe(C, A)) / Q(C);
      });
      w = [
        0,
        1,
        2,
        3
      ].sort((j, C) => b[j] - b[C]).slice(0, 2);
    }
    const n = q.map((b) => b[0]), O = q.map((b) => b[1]), s = Math.min(...n), a = Math.max(...n), i = Math.min(...O), l = Math.max(...O), h = [
      0,
      1,
      2,
      3
    ].map(() => ({
      pts: [],
      dA: 0
    }));
    let F = 0;
    for (let b = 0; b < o; b++) for (let j = 0; j < o; j++) {
      const C = s + (a - s) * (b + 0.5) / o, R = i + (l - i) * (j + 0.5) / o;
      let W = 0, Z = 0;
      for (let U = 0; U < 4; U++) {
        const Y = q[U], te = q[(U + 1) % 4];
        (te[0] - Y[0]) * (R - Y[1]) - (te[1] - Y[1]) * (C - Y[0]) >= 0 ? W++ : Z++;
      }
      if (W !== 4 && Z !== 4) continue;
      let _ = w[0], J = 1 / 0;
      for (const U of w) {
        const Y = q[U], te = q[(U + 1) % 4], ae = te[0] - Y[0], X = te[1] - Y[1], he = ae * ae + X * X, ce = Math.max(0, Math.min(1, ((C - Y[0]) * ae + (R - Y[1]) * X) / he)), H = Math.hypot(C - (Y[0] + ce * ae), R - (Y[1] + ce * X));
        H < J && (J = H, _ = U);
      }
      h[_].pts.push([
        r[0] + C * x[0] + R * L[0],
        r[1] + C * x[1] + R * L[1],
        r[2] + C * x[2] + R * L[2]
      ]), F++;
    }
    const E = 0.5 * Q(ve(V(d[2], d[0]), V(d[3], d[1])));
    for (const b of h) b.dA = F ? E / F : 0;
    return h;
  }
  function bs(d, o) {
    if (!(o > 0)) return;
    const A = 1e-6, r = (O) => d.nodes.get(O);
    let x = Math.max(0, ...d.nodes.keys()) + 1, T = d.shells.reduce((O, s) => Math.max(O, s.id), 0) + 1;
    const L = (O) => {
      for (const [a, i] of d.nodes) if (Q(V(i, O)) < A) return a;
      const s = x++;
      return d.nodes.set(s, [
        O[0],
        O[1],
        O[2]
      ]), s;
    }, q = (O, s) => {
      const a = d.shellModsDir.get(O);
      a && d.shellModsDir.set(s, [
        ...a
      ]);
      const i = d.shellMods.get(O);
      i && d.shellMods.set(s, [
        ...i
      ]);
      const l = d.shellLoads.get(O);
      l !== void 0 && d.shellLoads.set(s, l);
      const h = d.shellTypes.get(O);
      h !== void 0 && d.shellTypes.set(s, h);
      const F = d.shellAngles.get(O);
      F !== void 0 && d.shellAngles.set(s, F);
    }, w = [];
    let n = 0;
    for (const O of d.shells) {
      if (O.pts.length !== 4) {
        w.push(O);
        continue;
      }
      const s = O.pts.map(r);
      if (s.some((b) => !b)) {
        w.push(O);
        continue;
      }
      const a = (Q(V(s[1], s[0])) + Q(V(s[2], s[3]))) / 2, i = (Q(V(s[3], s[0])) + Q(V(s[2], s[1]))) / 2, l = Math.max(1, Math.ceil(a / o - 1e-9)), h = Math.max(1, Math.ceil(i / o - 1e-9));
      if (l === 1 && h === 1) {
        w.push(O);
        continue;
      }
      const F = (b, j) => [
        0,
        1,
        2
      ].map((C) => s[0][C] * (1 - b) * (1 - j) + s[1][C] * b * (1 - j) + s[2][C] * b * j + s[3][C] * (1 - b) * j), E = [];
      for (let b = 0; b <= l; b++) {
        const j = [];
        for (let C = 0; C <= h; C++) j.push(L(F(b / l, C / h)));
        E.push(j);
      }
      for (let b = 0; b < l; b++) for (let j = 0; j < h; j++) {
        const C = b === 0 && j === 0 ? O.id : T++;
        w.push({
          ...O,
          id: C,
          pts: [
            E[b][j],
            E[b + 1][j],
            E[b + 1][j + 1],
            E[b][j + 1]
          ]
        }), C !== O.id && q(O.id, C);
      }
      n++;
    }
    n && (d.shells = w, console.log(`[CLI Modeler] automesh ${o} m: ${n} pano(s) partido(s) -> ${d.shells.length} cascaras, ${d.nodes.size} nudos`));
  }
  function Ms(d) {
    const A = (i) => d.nodes.get(i), r = [
      ...d.nodes.keys()
    ], x = (i, l, h) => {
      const F = V(l, i), E = Q(F), b = ie(F, 1 / E), j = [];
      for (const C of r) {
        if (h.includes(C)) continue;
        const R = V(A(C), i), W = pe(R, b);
        W > 1e-6 && W < E - 1e-6 && Q(V(R, ie(b, W))) < 1e-4 && j.push(W / E);
      }
      return j.sort((C, R) => C - R);
    }, T = (i, l) => {
      const h = [];
      for (const F of i) l.some((E) => Math.abs(F - E) < 1e-5) && !h.some((E) => Math.abs(F - E) < 1e-5) && h.push(F);
      return h;
    }, L = (i) => {
      for (const l of r) if (Q(V(A(l), i)) < 1e-4) return l;
    };
    let q = d.shells.reduce((i, l) => Math.max(i, l.id), 0) + 1;
    const w = [], n = (i, l) => {
      const h = d.shellModsDir.get(i);
      h && d.shellModsDir.set(l, [
        ...h
      ]);
      const F = d.shellMods.get(i);
      F && d.shellMods.set(l, [
        ...F
      ]);
      const E = d.shellLoads.get(i);
      E !== void 0 && d.shellLoads.set(l, E);
      const b = d.shellTypes.get(i);
      b !== void 0 && d.shellTypes.set(l, b);
      const j = d.shellAngles.get(i);
      j !== void 0 && d.shellAngles.set(l, j);
    };
    for (const i of d.shells) {
      if (!He(d, i.id) || i.pts.length !== 4 || i.pts.some((_) => !d.nodes.has(_))) {
        w.push(i);
        continue;
      }
      const l = i.pts.map(A), h = x(l[0], l[1], i.pts), F = x(l[2], l[3], i.pts).map((_) => 1 - _), E = x(l[1], l[2], i.pts), b = x(l[3], l[0], i.pts).map((_) => 1 - _);
      let j = [
        0,
        ...T(h, F),
        1
      ], C = [
        0,
        ...T(E, b),
        1
      ];
      if (j.length === 2 && C.length === 2) {
        w.push(i);
        continue;
      }
      const R = (_, J) => [
        0,
        1,
        2
      ].map((U) => (1 - _) * (1 - J) * l[0][U] + _ * (1 - J) * l[1][U] + _ * J * l[2][U] + (1 - _) * J * l[3][U]);
      let W = C.map((_) => j.map((J) => L(R(J, _))));
      if (W.some((_) => _.some((J) => J === void 0)) && (j.length >= C.length ? C = [
        0,
        1
      ] : j = [
        0,
        1
      ], W = C.map((_) => j.map((J) => L(R(J, _)))), W.some((_) => _.some((J) => J === void 0)))) {
        w.push(i);
        continue;
      }
      let Z = true;
      for (let _ = 0; _ < C.length - 1; _++) for (let J = 0; J < j.length - 1; J++) {
        const U = [
          W[_][J],
          W[_][J + 1],
          W[_ + 1][J + 1],
          W[_ + 1][J]
        ], Y = Z ? i.id : q++;
        Z || n(i.id, Y), Z = false, w.push({
          id: Y,
          pts: U,
          t: i.t,
          E: i.E,
          rho: i.rho
        });
      }
    }
    d.shells = w;
    const O = 9.80665, s = (i, l) => {
      const h = d.loads.get(i) ?? [
        0,
        0,
        0,
        0,
        0,
        0
      ];
      d.loads.set(i, [
        h[0] + l[0],
        h[1] + l[1],
        h[2] + l[2],
        h[3] + l[3],
        h[4] + l[4],
        h[5] + l[5]
      ]);
    }, a = (i, l) => {
      const h = V(l, i), F = Q(h), E = ie(h, 1 / F);
      return d.frames.filter((b) => [
        b.nI,
        b.nJ
      ].every((j) => {
        const C = d.nodes.get(j);
        if (!C) return false;
        const R = V(C, i), W = pe(R, E);
        return W > -1e-4 && W < F + 1e-4 && Q(V(R, ie(E, W))) < 1e-4;
      }));
    };
    for (const i of d.shells) {
      if (!He(d, i.id) || i.pts.length !== 4) continue;
      const l = d.selfWeight ? (i.rho ?? 2.45) * i.t * O * d.selfWeight : 0, h = d.shellLoads.get(i.id) ?? 0, F = -l + h;
      if (Math.abs(F) < 1e-15) continue;
      const E = i.pts.map(A);
      let b;
      if (d.deckOneWay) {
        const C = V(E[1], E[0]);
        let R = ve(C, V(E[3], E[0]));
        R = ie(R, 1 / Q(R));
        const W = ie(C, 1 / Q(C)), Z = ve(R, W), _ = (d.shellAngles.get(i.id) ?? 0) * Math.PI / 180;
        b = [
          0,
          1,
          2
        ].map((J) => Math.cos(_) * W[J] + Math.sin(_) * Z[J]);
      }
      const j = gs(E, 200, b);
      for (let C = 0; C < 4; C++) {
        const { pts: R, dA: W } = j[C];
        if (!R.length) continue;
        const Z = E[C], _ = E[(C + 1) % 4], J = a(Z, _);
        if (!J.length) {
          const X = F * W * R.length;
          s(i.pts[C], [
            0,
            0,
            X / 2,
            0,
            0,
            0
          ]), s(i.pts[(C + 1) % 4], [
            0,
            0,
            X / 2,
            0,
            0,
            0
          ]);
          continue;
        }
        const U = V(_, Z), Y = Q(U), te = ie(U, 1 / Y), ae = R.map((X) => pe(V(X, Z), te));
        for (const X of J) {
          const he = A(X.nI), ce = A(X.nJ), H = pe(V(he, Z), te), le = pe(V(ce, Z), te), be = Math.min(H, le), de = Math.max(H, le), re = de - be;
          if (re < 1e-9) continue;
          const Fe = de >= Y - 1e-6, ee = ie(V(ce, he), 1 / re), se = ve(ee, [
            0,
            0,
            1
          ]);
          let Me = 0, fe = 0, we = 0, ne = 0;
          for (const ue of ae) {
            if (ue < be - 1e-9 || (Fe ? ue > de + 1e-9 : ue >= de - 1e-9)) continue;
            let Ie = ue - be;
            H > le && (Ie = re - Ie);
            const G = Ie / re;
            Me += 1 - 3 * G * G + 2 * G * G * G, fe += re * (G - 2 * G * G + G * G * G), we += 3 * G * G - 2 * G * G * G, ne += re * (-G * G + G * G * G);
          }
          const oe = F * W;
          s(X.nI, [
            0,
            0,
            oe * Me,
            se[0] * oe * fe,
            se[1] * oe * fe,
            se[2] * oe * fe
          ]), s(X.nJ, [
            0,
            0,
            oe * we,
            se[0] * oe * ne,
            se[1] * oe * ne,
            se[2] * oe * ne
          ]);
        }
      }
      d.deckTributario.add(i.id), d.shellLoads.delete(i.id);
    }
  }
  xs = {
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
    runModal(d, o, A) {
      var _a;
      const r = o.nodes.val, x = o.elements.val;
      if (!(!r.length || !x.length)) try {
        const T = Math.max(1, parseInt(window.__hekatanCliModalModes ?? "12", 10) || 12), L = o.nodeInputs.val, q = window.__hekatanCliSprings, w = ls(r, x, L, o.elementInputs.val, T, 0, 0, 1, (L == null ? void 0 : L.diaphragms) instanceof Map && L.diaphragms.size ? L.diaphragms : void 0, q && q.length ? q : void 0);
        console.log(`[CLI Modeler] Modal OK \u2014 ${w.frequencies.length} modos, T1 = ${w.frequencies[0] ? (1 / w.frequencies[0]).toFixed(5) : "\u2014"} s`), (_a = A == null ? void 0 : A.render) == null ? void 0 : _a.call(A, w, {
          title: "Modal del .heks (masa 3D, como SAP2000)"
        });
      } catch (T) {
        console.error("[CLI Modeler] modal:", (T == null ? void 0 : T.message) ?? T);
      }
    },
    build(d, o) {
      var _a, _b, _c, _d;
      const A = window.__hekatanCliScript ?? ms;
      window.__hekatanCliLastScript = A;
      const r = us(A);
      r.autoMesh > 0 && bs(r, r.autoMesh), r.deckEtabs && Ms(r);
      const x = /* @__PURE__ */ new Map(), T = /* @__PURE__ */ new Map(), L = [], q = Array.from(r.nodes.keys()).sort((e, p) => e - p);
      for (const e of q) x.set(e, L.length), L.push(r.nodes.get(e));
      const w = [], n = /* @__PURE__ */ new Map(), O = /* @__PURE__ */ new Map(), s = /* @__PURE__ */ new Map(), a = /* @__PURE__ */ new Map(), i = /* @__PURE__ */ new Map(), l = /* @__PURE__ */ new Map(), h = /* @__PURE__ */ new Map(), F = /* @__PURE__ */ new Map(), E = /* @__PURE__ */ new Map(), b = /* @__PURE__ */ new Map(), j = /* @__PURE__ */ new Map(), C = /* @__PURE__ */ new Map(), R = /* @__PURE__ */ new Map(), W = /* @__PURE__ */ new Map(), Z = /* @__PURE__ */ new Map(), _ = /* @__PURE__ */ new Map(), J = /* @__PURE__ */ new Map(), U = /* @__PURE__ */ new Map(), Y = /* @__PURE__ */ new Map(), te = /* @__PURE__ */ new Map();
      for (const e of r.frames) {
        const p = x.get(e.nI), m = x.get(e.nJ);
        if (p === void 0 || m === void 0) {
          const k = q.length ? `IDs disponibles: ${q.join(", ")}` : "ning\xFAn nodo definido", N = [];
          p === void 0 && N.push(e.nI), m === void 0 && N.push(e.nJ), r.errors.push(`frame ${e.id}: nodo(s) inexistente(s) [${N.join(", ")}] \u2014 ${k}`);
          continue;
        }
        const t = w.length;
        w.push([
          p,
          m
        ]);
        const c = e.nu ?? 0.2;
        n.set(t, e.E), O.set(t, e.E / (2 * (1 + c))), s.set(t, e.A), a.set(t, e.I), i.set(t, e.Iy ?? e.I), l.set(t, e.J ?? 0.14 * Math.pow(Math.sqrt(e.A), 4)), h.set(t, e.rho ?? 2.45), Y.set(t, c), e.D !== void 0 && isFinite(e.D) && F.set(t, e.D), e.B !== void 0 && isFinite(e.B) && E.set(t, e.B);
        const u = r.frameAngles.get(e.id);
        u !== void 0 && isFinite(u) && j.set(t, u);
        const g = r.frameReleases.get(e.id);
        g && C.set(t, g);
        const f = r.frameEndOffsets.get(e.id);
        f && R.set(t, f);
        const v = r.frameLoads.get(e.id);
        v && _.set(t, v);
        const y = r.frameShearAreas.get(e.id);
        if (y && (U.set(t, y[0]), J.set(t, y[1])), e.sec || e.D !== void 0 && e.B !== void 0) {
          const k = {
            type: "general"
          };
          e.sec && (k.name = e.sec), e.D !== void 0 && isFinite(e.D) && (k.h = e.D), e.B !== void 0 && isFinite(e.B) && (k.b = e.B), b.set(t, k);
        }
        const M = r.frameISec.get(e.id);
        if (M) {
          const k = es(M.d, M.bf, M.tf, M.tw, M.t2b, M.tfb);
          s.set(t, k.A), i.set(t, k.Iz), a.set(t, k.Iy), l.set(t, k.J), U.set(t, k.As2), J.set(t, k.As3), F.set(t, M.d), E.set(t, Math.max(M.bf, M.t2b));
          const N = (B) => Math.round(B * 1e4) / 10;
          b.set(t, {
            type: "I",
            h: M.d,
            b: M.bf,
            tf: M.tf,
            tw: M.tw,
            t2b: M.t2b,
            tfb: M.tfb,
            name: e.sec ?? `I${N(M.d)}X${N(M.bf)}X${N(M.tf)}X${N(M.tw)}`
          });
        }
        const I = r.frameTube.get(e.id);
        if (I) {
          const k = ss(I.b, I.h, I.tf, I.tw);
          s.set(t, k.A), i.set(t, k.Iz), a.set(t, k.Iy), l.set(t, k.J), U.set(t, k.As2), J.set(t, k.As3), F.set(t, I.h), E.set(t, I.b);
          const N = (B) => Math.round(B * 1e4) / 10;
          b.set(t, {
            type: "HSS",
            h: I.h,
            b: I.b,
            tf: I.tf,
            tw: I.tw,
            name: e.sec ?? `TUBO${N(I.h)}X${N(I.b)}X${N(I.tf)}X${N(I.tw)}`
          });
        }
        const S = r.frameCanal.get(e.id);
        if (S) {
          const k = ts(S.d, S.bf, S.tf, S.tw);
          s.set(t, k.A), i.set(t, k.Iz), a.set(t, k.Iy), l.set(t, k.J), U.set(t, k.As2), J.set(t, k.As3), F.set(t, S.d), E.set(t, S.bf);
          const N = (B) => Math.round(B * 1e4) / 10;
          b.set(t, {
            type: "C",
            h: S.d,
            b: S.bf,
            tf: S.tf,
            tw: S.tw,
            name: e.sec ?? `C${N(S.d)}X${N(S.bf)}X${N(S.tf)}X${N(S.tw)}`
          });
        }
        const D = r.frameDosL.get(e.id);
        if (D) {
          const k = os(D.d, D.t2, D.tf, D.tw, D.dis);
          s.set(t, k.A), i.set(t, k.Iz), a.set(t, k.Iy), l.set(t, k.J), U.set(t, k.As2), J.set(t, k.As3), F.set(t, D.d), E.set(t, D.t2);
          const N = (B) => Math.round(B * 1e4) / 10;
          b.set(t, {
            type: "2L",
            h: D.d,
            b: D.t2,
            tf: D.tf,
            tw: D.tw,
            dis: D.dis,
            name: e.sec ?? `2L${N(D.d)}X${N(D.t2)}X${N(D.tf)}X${N(D.tw)}S${N(D.dis)}`
          });
        }
        const $ = r.frameCftc.get(e.id);
        if ($) {
          const k = ns($.D, $.t, e.E, c, $.Ec, $.nuC);
          s.set(t, k.A), i.set(t, k.Iz), a.set(t, k.Iy), l.set(t, k.J), U.set(t, k.As2), J.set(t, k.As3), F.set(t, $.D), E.set(t, $.D);
          const N = $.D - 2 * $.t, B = Math.PI * N * N / 4, P = Math.PI * $.D * $.D / 4 - B;
          h.set(t, ((e.rho ?? 7.85) * P + $.rhoC * B) / k.A), b.set(t, {
            type: "CFT",
            d: $.D,
            tw: $.t,
            fillE: $.Ec,
            fillRho: $.rhoC,
            steelRho: e.rho ?? 7.85,
            name: e.sec ?? `CFTC ${Math.round($.D * 1e3)}X${Math.round($.t * 1e3)}`
          });
        }
        const z = r.frameCft.get(e.id);
        if (z) {
          const k = as(z.b, z.h, z.t, e.E, c, z.Ec, z.nuC, z.tw);
          s.set(t, k.A), i.set(t, k.Iz), a.set(t, k.Iy), l.set(t, k.J), U.set(t, k.As2), J.set(t, k.As3), F.set(t, z.h), E.set(t, z.b);
          const N = (z.b - 2 * z.tw) * (z.h - 2 * z.t), B = z.b * z.h - N;
          h.set(t, ((e.rho ?? 7.85) * B + z.rhoC * N) / k.A);
          const P = (K) => Math.round(K * 1e3);
          b.set(t, {
            type: "CFT",
            b: z.b,
            h: z.h,
            tw: z.tw,
            tf: z.t,
            fillE: z.Ec,
            fillRho: z.rhoC,
            steelRho: e.rho ?? 7.85,
            name: e.sec ?? `CFT ${P(z.h)}X${P(z.b)}X${P(z.t)}${z.tw !== z.t ? `X${P(z.tw)}` : ""}`
          });
        }
      }
      if (r.meshCross) {
        const e = (g, f) => g[0] * f[0] + g[1] * f[1] + g[2] * f[2], p = [
          n,
          O,
          s,
          a,
          i,
          l,
          h,
          Y,
          F,
          E,
          j,
          J,
          U,
          b,
          _
        ], m = (g, f) => {
          for (const v of p) v.has(g) && v.set(f, v.get(g));
        }, t = (g) => {
          for (let f = 0; f < L.length; f++) if (Math.hypot(L[f][0] - g[0], L[f][1] - g[1], L[f][2] - g[2]) < 1e-6) return f;
          return L.push([
            g[0],
            g[1],
            g[2]
          ]), L.length - 1;
        }, c = (g) => {
          const f = L[g[0]], v = L[g[1]];
          return [
            Math.min(f[0], v[0]),
            Math.min(f[1], v[1]),
            Math.min(f[2], v[2]),
            Math.max(f[0], v[0]),
            Math.max(f[1], v[1]),
            Math.max(f[2], v[2])
          ];
        };
        let u = 0;
        for (let g = 0; g < w.length; g++) {
          if (w[g].length !== 2) continue;
          const f = c(w[g]);
          for (let v = g + 1; v < w.length; v++) {
            if (w[v].length !== 2) continue;
            const [y, M] = w[g], [I, S] = w[v];
            if (y === I || y === S || M === I || M === S) continue;
            const D = c(w[v]);
            if (f[0] > D[3] + 1e-6 || D[0] > f[3] + 1e-6 || f[1] > D[4] + 1e-6 || D[1] > f[4] + 1e-6 || f[2] > D[5] + 1e-6 || D[2] > f[5] + 1e-6) continue;
            const $ = L[y], z = L[M], k = L[I], N = L[S], B = [
              z[0] - $[0],
              z[1] - $[1],
              z[2] - $[2]
            ], P = [
              N[0] - k[0],
              N[1] - k[1],
              N[2] - k[2]
            ], K = [
              $[0] - k[0],
              $[1] - k[1],
              $[2] - k[2]
            ], me = e(B, B), De = e(B, P), je = e(P, P), Pe = e(B, K), Ue = e(P, K), Ne = me * je - De * De;
            if (Ne < 1e-10 * me * je) continue;
            const Ce = (De * Ue - je * Pe) / Ne, Le = (me * Ue - De * Pe) / Ne;
            if (Ce < 1e-6 || Ce > 1 - 1e-6 || Le < 1e-6 || Le > 1 - 1e-6) continue;
            const ze = [
              $[0] + Ce * B[0],
              $[1] + Ce * B[1],
              $[2] + Ce * B[2]
            ], Te = [
              k[0] + Le * P[0],
              k[1] + Le * P[1],
              k[2] + Le * P[2]
            ];
            if (Math.hypot(ze[0] - Te[0], ze[1] - Te[1], ze[2] - Te[2]) > 1e-6) continue;
            const Ge = t(ze);
            for (const ge of [
              g,
              v
            ]) {
              const [Ke, Qe] = w[ge], _e = w.length;
              w[ge] = [
                Ke,
                Ge
              ], w.push([
                Ge,
                Qe
              ]), m(ge, _e);
              const Re = C.get(ge);
              Re && (C.set(ge, [
                ...Re.slice(0, 6),
                ...Array(6).fill(false)
              ]), C.set(_e, [
                ...Array(6).fill(false),
                ...Re.slice(6)
              ]));
              const ye = R.get(ge);
              ye && (R.set(ge, [
                ye[0],
                0,
                ye[2]
              ]), R.set(_e, [
                0,
                ye[1],
                ye[2]
              ]));
            }
            u++;
          }
        }
        u > 0 && console.log(`[CLI Modeler] ${u} cruces de barras partidos con nudo (como ETABS; meshcross 0 lo apaga)`);
      }
      for (const e of r.shells) {
        const p = e.pts.map((u) => x.get(u));
        if (p.some((u) => u === void 0)) {
          r.errors.push(`shell ${e.id}: algun nodo inexistente`);
          continue;
        }
        const m = w.length;
        T.set(e.id, m), w.push(p), n.set(m, e.E), O.set(m, e.E / (2 * 1.2)), te.set(m, e.t), h.set(m, e.rho ?? 2.45), Y.set(m, 0.2);
        const t = r.shellTypes.get(e.id);
        t !== void 0 && W.set(m, t);
        const c = r.deckSecs.get(e.id);
        if (c) {
          const u = c.tc + (c.sr > 0 ? c.hr * (c.wrt + c.wrb) / 2 / c.sr : 0);
          te.set(m, c.tc), h.set(m, ((e.rho ?? 2.45) * u + c.w / 9.80665) / c.tc), Z.set(m, {
            ...c
          });
        }
      }
      const ae = /* @__PURE__ */ new Map();
      for (const [e, p] of r.supports.entries()) {
        const m = x.get(e);
        m !== void 0 && ae.set(m, p);
      }
      const X = /* @__PURE__ */ new Map();
      for (const [e, p] of r.loads.entries()) {
        const m = x.get(e);
        m !== void 0 && X.set(m, [
          ...p
        ]);
      }
      const he = /* @__PURE__ */ new Map();
      for (const [e, p] of r.diaphragms.entries()) {
        const m = x.get(e);
        m !== void 0 && he.set(m, p);
      }
      const ce = /* @__PURE__ */ new Map();
      for (const [e, p] of r.masses.entries()) {
        const m = x.get(e);
        m !== void 0 && ce.set(m, p);
      }
      const H = /* @__PURE__ */ new Map();
      for (const [e, p] of r.loadsPat) {
        const m = /* @__PURE__ */ new Map();
        for (const [t, c] of p) {
          const u = x.get(t);
          u !== void 0 && m.set(u, [
            ...c
          ]);
        }
        H.set(e, m);
      }
      const le = {
        Dead: new Map([
          ...X
        ].map(([e, p]) => [
          e,
          [
            ...p
          ]
        ]))
      };
      for (const [e, p] of H) le[e] = new Map([
        ...p
      ].map(([m, t]) => [
        m,
        [
          ...t
        ]
      ]));
      const be = [
        [
          r.frameLoads,
          X
        ]
      ];
      for (const [e, p] of r.frameLoadsPat) H.has(e) || H.set(e, /* @__PURE__ */ new Map()), be.push([
        p,
        H.get(e)
      ]);
      for (const [e, p] of be) if (e.size) {
        const m = (t, c) => {
          const u = p.get(t) ?? [
            0,
            0,
            0,
            0,
            0,
            0
          ];
          p.set(t, [
            u[0] + c[0],
            u[1] + c[1],
            u[2] + c[2],
            u[3] + c[3],
            u[4] + c[4],
            u[5] + c[5]
          ]);
        };
        for (const [t, c] of e.entries()) {
          const u = r.frames.find((z) => z.id === t);
          if (!u) {
            r.errors.push(`frameload ${t}: no existe esa barra`);
            continue;
          }
          const g = x.get(u.nI), f = x.get(u.nJ);
          if (g === void 0 || f === void 0) continue;
          const v = L[g], y = L[f], M = [
            y[0] - v[0],
            y[1] - v[1],
            y[2] - v[2]
          ], I = Math.hypot(M[0], M[1], M[2]);
          if (I < 1e-9) continue;
          const S = [
            M[0] / I,
            M[1] / I,
            M[2] / I
          ], D = I * I / 12, $ = [
            S[1] * c[2] - S[2] * c[1],
            S[2] * c[0] - S[0] * c[2],
            S[0] * c[1] - S[1] * c[0]
          ];
          m(g, [
            c[0] * I / 2,
            c[1] * I / 2,
            c[2] * I / 2,
            D * $[0],
            D * $[1],
            D * $[2]
          ]), m(f, [
            c[0] * I / 2,
            c[1] * I / 2,
            c[2] * I / 2,
            -D * $[0],
            -D * $[1],
            -D * $[2]
          ]);
        }
      }
      const de = /* @__PURE__ */ new Map(), re = (e, p) => {
        const m = 1 / Math.sqrt(3), t = [
          [
            -m,
            -m
          ],
          [
            m,
            -m
          ],
          [
            m,
            m
          ],
          [
            -m,
            m
          ]
        ], c = [
          0,
          0,
          0,
          0
        ];
        for (const [u, g] of t) {
          const f = [
            0.25 * (1 - u) * (1 - g),
            0.25 * (1 + u) * (1 - g),
            0.25 * (1 + u) * (1 + g),
            0.25 * (1 - u) * (1 + g)
          ], v = [
            -0.25 * (1 - g),
            0.25 * (1 - g),
            0.25 * (1 + g),
            -0.25 * (1 + g)
          ], y = [
            -0.25 * (1 - u),
            -0.25 * (1 + u),
            0.25 * (1 + u),
            0.25 * (1 - u)
          ], M = [
            0,
            1,
            2
          ].map(($) => v.reduce((z, k, N) => z + k * e[N][$], 0)), I = [
            0,
            1,
            2
          ].map(($) => y.reduce((z, k, N) => z + k * e[N][$], 0)), S = [
            M[1] * I[2] - M[2] * I[1],
            M[2] * I[0] - M[0] * I[2],
            M[0] * I[1] - M[1] * I[0]
          ], D = Math.hypot(S[0], S[1], S[2]);
          for (let $ = 0; $ < 4; $++) c[$] += f[$] * p * D;
        }
        return c;
      }, Fe = (e, p) => {
        const m = e.pts.map((c) => x.get(c));
        if (m.some((c) => c === void 0)) return null;
        const t = m.map((c) => L[c]);
        return {
          idx: m,
          f: re(t, p)
        };
      };
      for (const e of r.shells) {
        const p = r.shellLoads.get(e.id);
        if (!p || r.deckTributario.has(e.id)) continue;
        const m = Fe(e, p);
        if (!m) {
          r.errors.push(`areaload ${e.id}: algun nodo inexistente`);
          continue;
        }
        for (let t = 0; t < 4; t++) {
          const c = m.idx[t], u = X.get(c) ?? [
            0,
            0,
            0,
            0,
            0,
            0
          ];
          u[2] += m.f[t], X.set(c, u), de.set(c, (de.get(c) ?? 0) + m.f[t]);
        }
      }
      for (const [e, p] of r.shellLoadsPat) {
        H.has(e) || H.set(e, /* @__PURE__ */ new Map());
        const m = H.get(e);
        for (const [t, c] of p) {
          const u = r.shells.find((f) => f.id === t);
          if (!u || !c) continue;
          const g = Fe(u, c);
          if (!g) {
            r.errors.push(`areaload ${t} ${e}: algun nodo inexistente`);
            continue;
          }
          for (let f = 0; f < 4; f++) {
            const v = g.idx[f], y = m.get(v) ?? [
              0,
              0,
              0,
              0,
              0,
              0
            ];
            y[2] += g.f[f], m.set(v, y);
          }
        }
      }
      for (const [e, p] of [
        [
          "Dead",
          r.shellLoads
        ],
        ...r.shellLoadsPat
      ]) {
        const m = le[e] ?? (le[e] = /* @__PURE__ */ new Map());
        for (const [t, c] of p) {
          if (!c || e === "Dead" && r.deckTributario.has(t)) continue;
          const u = r.shells.find((f) => f.id === t), g = u ? Fe(u, c) : null;
          if (g) for (let f = 0; f < 4; f++) {
            const v = m.get(g.idx[f]) ?? [
              0,
              0,
              0,
              0,
              0,
              0
            ];
            v[2] += g.f[f], m.set(g.idx[f], v);
          }
        }
      }
      if (r.selfWeight) {
        const p = /* @__PURE__ */ new Set();
        for (const [t, c] of T) r.deckTributario.has(t) && p.add(c);
        const m = (t, c) => {
          const u = X.get(t) ?? [
            0,
            0,
            0,
            0,
            0,
            0
          ];
          u[2] += c, X.set(t, u);
        };
        w.forEach((t, c) => {
          const u = h.get(c) ?? 0;
          if (u && !p.has(c)) {
            if (t.length === 2) {
              const g = s.get(c) ?? 0, f = L[t[0]], v = L[t[1]], y = [
                v[0] - f[0],
                v[1] - f[1],
                v[2] - f[2]
              ];
              let M = Math.hypot(y[0], y[1], y[2]);
              const I = R.get(c);
              if (I) {
                const B = Math.hypot(y[0], y[1]);
                B > 1e-9 && Math.abs(Math.atan2(Math.abs(y[2]), B)) * 180 / Math.PI < 20 && (M = Math.max(M - I[0] - I[1], 0));
              }
              const S = Math.hypot(y[0], y[1], y[2]), D = -g * u * 9.80665 * r.selfWeight, $ = [
                y[0] / S,
                y[1] / S,
                y[2] / S
              ], z = M * M / 12, k = [
                $[1] * D,
                -$[0] * D,
                0
              ], N = (B, P) => {
                const K = X.get(B) ?? [
                  0,
                  0,
                  0,
                  0,
                  0,
                  0
                ];
                X.set(B, [
                  K[0] + P[0],
                  K[1] + P[1],
                  K[2] + P[2],
                  K[3] + P[3],
                  K[4] + P[4],
                  K[5] + P[5]
                ]);
              };
              N(t[0], [
                0,
                0,
                D * M / 2,
                z * k[0],
                z * k[1],
                0
              ]), N(t[1], [
                0,
                0,
                D * M / 2,
                -z * k[0],
                -z * k[1],
                0
              ]);
            } else if (t.length === 4) {
              const g = te.get(c) ?? 0, f = t.map((M) => L[M]);
              let v = 0;
              for (let M = 1; M < 3; M++) {
                const I = [
                  f[M][0] - f[0][0],
                  f[M][1] - f[0][1],
                  f[M][2] - f[0][2]
                ], S = [
                  f[M + 1][0] - f[0][0],
                  f[M + 1][1] - f[0][1],
                  f[M + 1][2] - f[0][2]
                ], D = [
                  I[1] * S[2] - I[2] * S[1],
                  I[2] * S[0] - I[0] * S[2],
                  I[0] * S[1] - I[1] * S[0]
                ];
                v += Math.hypot(D[0], D[1], D[2]) / 2;
              }
              const y = v * g * u * 9.80665 * r.selfWeight;
              for (const M of t) m(M, -y / 4);
            }
          }
        });
      }
      const ee = [], se = [], Me = /* @__PURE__ */ new Set(), fe = /* @__PURE__ */ new Map();
      for (const e of r.springs) {
        const p = x.get(e.node);
        if (p === void 0) continue;
        const m = {
          node: p,
          dof: e.dof,
          k: e.k
        };
        ee.push(m), e.comp && (se.push({
          ...m
        }), Me.add(m));
      }
      const we = /* @__PURE__ */ new Set();
      for (const e of r.areaSprings) {
        const p = T.get(e.id);
        if (p === void 0) {
          r.errors.push(`areaspring ${e.id}: no existe esa cascara`);
          continue;
        }
        if (e.comp) {
          const m = w[p], t = m.map((u) => L[u]);
          if (t.every((u) => Math.abs(u[2] - t[0][2]) < 1e-9)) {
            const u = Ve(t);
            m.forEach((f, v) => fe.set(f, (fe.get(f) ?? 0) + e.ks * u[v])), we.add(e.id);
            const g = {
              node: -(p + 1),
              dof: -3,
              k: e.ks
            };
            ee.push(g), Me.add(g);
            continue;
          }
          r.errors.push(`areaspring ${e.id} compresion: solo en c\xE1scaras horizontales; se toma LINEAL`);
        }
        ee.push({
          node: -(p + 1),
          dof: e.nodal ? -3 : -1,
          k: e.ks
        });
      }
      for (const [e, p] of fe) se.push({
        node: e,
        dof: 2,
        k: p
      });
      {
        const e = /* @__PURE__ */ new Map();
        for (const p of r.areaSprings) {
          const m = T.get(p.id);
          if (m === void 0) continue;
          const t = w[m], c = t.map((g) => L[g]);
          if (!c.every((g) => Math.abs(g[2] - c[0][2]) < 1e-9)) continue;
          const u = Ve(c);
          t.forEach((g, f) => {
            const v = e.get(g) ?? {
              k: 0,
              comp: !!p.comp
            };
            v.k += p.ks * u[f], e.set(g, v);
          });
        }
        window.__hekatanCliMuellesNodales = [
          ...e
        ].map(([p, m]) => ({
          node: p,
          k: m.k,
          comp: m.comp
        }));
      }
      if (r.edgeEtabs) {
        const e = r.edgeLineal, p = e ? 1e-4 : 1e-6, m = /* @__PURE__ */ new Set(), t = [];
        w.forEach((u, g) => {
          if (u.length === 3 || u.length === 4) {
            t.push(g);
            for (const f of u) m.add(f);
          }
        });
        let c = 0;
        for (const u of t) {
          const g = w[u], f = g.map((y) => L[y]), v = [
            0,
            1,
            2
          ].map((y) => [
            Math.min(...f.map((M) => M[y])),
            Math.max(...f.map((M) => M[y]))
          ]);
          for (let y = 0; y < L.length; y++) {
            if (g.includes(y)) continue;
            const M = L[y], I = e ? p * Math.max(v[0][1] - v[0][0], v[1][1] - v[1][0], v[2][1] - v[2][0]) : 1e-6;
            if (M[0] < v[0][0] - I || M[0] > v[0][1] + I || M[1] < v[1][0] - I || M[1] > v[1][1] + I || M[2] < v[2][0] - I || M[2] > v[2][1] + I) continue;
            let S = false;
            for (let $ = 0; $ < g.length && !S; $++) {
              const z = f[$], k = f[($ + 1) % g.length], N = [
                k[0] - z[0],
                k[1] - z[1],
                k[2] - z[2]
              ], B = N[0] * N[0] + N[1] * N[1] + N[2] * N[2];
              if (B < 1e-24) continue;
              const P = [
                M[0] - z[0],
                M[1] - z[1],
                M[2] - z[2]
              ], K = (P[0] * N[0] + P[1] * N[1] + P[2] * N[2]) / B;
              if (K <= 1e-6 || K >= 1 - 1e-6) continue;
              const me = [
                P[0] - K * N[0],
                P[1] - K * N[1],
                P[2] - K * N[2]
              ];
              Math.hypot(me[0], me[1], me[2]) <= p * Math.sqrt(B) && (S = true);
            }
            !S || !(e || w.some(($, z) => z !== u && $.includes(y))) || (ee.push({
              node: -(u + 1),
              dof: e ? -4 : -2,
              k: y
            }), c++);
          }
        }
        c && console.log(`[CLI Modeler] edge ${e ? "lineal" : "etabs"}: ${c} nudo(s) colgado(s) atado(s) a su arista (${e ? "lineal" : "Hermite"})`);
      }
      const ne = [];
      for (const e of r.solids) {
        const p = e.pts.map((t) => x.get(t));
        if (p.some((t) => t === void 0)) {
          r.errors.push(`hex ${e.id}: algun nodo inexistente`);
          continue;
        }
        const m = w.length;
        if (w.push(p), n.set(m, e.E), Y.set(m, e.nu), O.set(m, e.E / (2 * (1 + e.nu))), h.set(m, e.rho), ne.push(m), r.selfWeight && e.rho) {
          const t = p.map((f) => L[f]), c = (f, v, y, M) => {
            const I = [
              0,
              1,
              2
            ].map(($) => t[v][$] - t[f][$]), S = [
              0,
              1,
              2
            ].map(($) => t[y][$] - t[f][$]), D = [
              0,
              1,
              2
            ].map(($) => t[M][$] - t[f][$]);
            return Math.abs(I[0] * (S[1] * D[2] - S[2] * D[1]) - I[1] * (S[0] * D[2] - S[2] * D[0]) + I[2] * (S[0] * D[1] - S[1] * D[0])) / 6;
          }, g = (c(0, 1, 2, 6) + c(0, 2, 3, 6) + c(0, 3, 7, 6) + c(0, 7, 4, 6) + c(0, 4, 5, 6) + c(0, 5, 1, 6)) * e.rho * 9.80665 * r.selfWeight;
          for (const f of p) {
            const v = X.get(f) ?? [
              0,
              0,
              0,
              0,
              0,
              0
            ];
            v[2] -= g / 8, X.set(f, v);
          }
        }
      }
      const oe = /* @__PURE__ */ new Set();
      for (const e of w) for (const p of e) oe.add(p);
      for (const [e] of ae) oe.add(e);
      for (const e of ee) e.node >= 0 ? oe.add(e.node) : (e.dof === -2 || e.dof === -4) && oe.add(e.k);
      const ue = (e) => q[e] ?? e, Ie = {
        Dead: X,
        ...Object.fromEntries(H)
      }, G = /* @__PURE__ */ new Set(), ke = {};
      for (const [e, p] of Object.entries(Ie)) for (const [m, t] of p) {
        if (oe.has(m) || !t.some((u) => Math.abs(u) > 1e-9)) continue;
        G.add(m);
        const c = ke[e] ?? (ke[e] = [
          0,
          0,
          0
        ]);
        c[0] += t[0], c[1] += t[1], c[2] += t[2];
      }
      let xe = null, $e = null;
      if (G.size) {
        const e = [
          ...G
        ].map(ue).sort((t, c) => t - c).join(", "), p = Object.entries(ke).map(([t, c]) => `${t} ${c[2].toFixed(0)} kN`).join(", "), m = Object.values(ke).reduce((t, c) => t + Math.abs(c[2]), 0);
        xe = `${G.size} carga(s) en nudos SIN RIGIDEZ [${e}]: ${m.toFixed(0)} kN se perder\xEDan sin avisar (${p})`, r.errors.push(xe), console.warn("[CLI Modeler] \u26A0", xe);
      }
      window.__hekatanCliNudosSinRigidez = G.size ? {
        nudos: [
          ...G
        ].map(ue),
        perdidaPorPatron: ke,
        mensaje: xe
      } : null, o.nodes.val = L, o.elements.val = w, o.nodeInputs.val = {
        supports: ae,
        loads: X,
        masses: ce,
        diaphragms: he,
        cargasPorPatron: le,
        springs: ee
      }, o.springs && (o.springs.val = ee);
      const Ee = /* @__PURE__ */ new Map(), Se = /* @__PURE__ */ new Map(), qe = /* @__PURE__ */ new Map(), We = /* @__PURE__ */ new Map(), Xe = /* @__PURE__ */ new Map();
      for (const e of r.shells) {
        const p = T.get(e.id);
        if (p === void 0) continue;
        const m = r.shellLoads.get(e.id);
        m !== void 0 && We.set(p, m);
        const t = r.shellAngles.get(e.id);
        t !== void 0 && Xe.set(p, t);
        const c = r.shellModsDir.get(e.id);
        if (c) {
          qe.set(p, c), Ee.set(p, (c[0] + c[1]) / 2), Se.set(p, (c[3] + c[4]) / 2);
          continue;
        }
        const u = r.shellMods.get(e.id);
        u ? (Ee.set(p, u[0]), Se.set(p, u[1])) : r.deckSecs.has(e.id) && (Ee.set(p, 1), Se.set(p, 0));
      }
      if (o.elementInputs.val = {
        elasticities: n,
        shearModuli: O,
        areas: s,
        momentsOfInertiaY: a,
        momentsOfInertiaZ: i,
        torsionalConstants: r.torsionFactor !== 1 ? new Map([
          ...l
        ].map(([e, p]) => [
          e,
          p * r.torsionFactor
        ])) : l,
        densities: h,
        poissonsRatios: Y,
        thicknesses: te,
        membraneModifiers: Ee,
        bendingModifiers: Se,
        shellModifiers: qe,
        shellSurfaceLoads: We,
        shellAngles: Xe,
        cargaDeArea: de,
        cantos: F,
        anchos: E,
        sectionShapes: b,
        localAngles: j,
        shearAreasY: J,
        shearAreasZ: U,
        momentReleases: C,
        endOffsets: R,
        plateFormulations: W,
        deckSections: Z,
        frameLoads: _,
        frameLoadsPorPatron: (() => {
          const e = {
            Dead: _
          }, p = /* @__PURE__ */ new Map();
          w.forEach((m, t) => {
            if (m.length === 2) {
              const c = r.frames.find((u) => x.get(u.nI) === m[0] && x.get(u.nJ) === m[1]);
              c && p.set(c.id, t);
            }
          });
          for (const [m, t] of r.frameLoadsPat) {
            const c = /* @__PURE__ */ new Map();
            for (const [u, g] of t) {
              const f = p.get(u);
              f !== void 0 && c.set(f, g);
            }
            e[m] = c;
          }
          return e;
        })(),
        combos: r.combos,
        fcExport: r.fc,
        areaSpringsExport: new Map(r.areaSprings.map((e) => [
          T.get(e.id),
          {
            ks: e.ks,
            nodal: e.nodal,
            comp: !!e.comp
          }
        ]).filter(([e]) => e !== void 0)),
        meshAtIntersections: r.meshCross,
        solidIncompatible: r.solidIncompatible,
        selfWeight: r.selfWeight,
        etabsWallJoint: r.etabsWallJoint,
        areaObjects: r.areaObjs.map((e) => ({
          nodes: e.pts.map((p) => x.get(p)).filter((p) => p !== void 0),
          cells: e.cells.map((p) => T.get(p)).filter((p) => p !== void 0),
          q: e.cells.map((p) => r.shellLoads.get(p)).find((p) => p !== void 0),
          ang: e.cells.map((p) => r.shellAngles.get(p)).find((p) => p !== void 0)
        })).filter((e) => e.nodes.length === 4 && e.cells.length > 0)
      }, r.doSolve && ne.length > 0 && ne.length === w.length && ee.length === 0) try {
        const e = n.get(ne[0]) ?? 25e6, p = Y.get(ne[0]) ?? 0.2;
        ne.some((g) => Math.abs((n.get(g) ?? e) - e) > 1e-9 * e || Math.abs((Y.get(g) ?? p) - p) > 1e-12) && r.errors.push("hex: hex8Solve lleva UN material; los solidos tienen E o nu distintos y se usa el del primero");
        const m = /* @__PURE__ */ new Map();
        for (const [g, f] of o.nodeInputs.val.supports ?? []) m.set(g, [
          !!f[0],
          !!f[1],
          !!f[2]
        ]);
        const t = /* @__PURE__ */ new Map();
        for (const [g, f] of Ye({
          Dead: X,
          ...Object.fromEntries(H)
        })) t.set(g, [
          f[0] ?? 0,
          f[1] ?? 0,
          f[2] ?? 0
        ]);
        const c = is({
          nodes: L,
          elements: w,
          E: e,
          nu: p,
          supports: m,
          loads: t,
          incompatible: r.solidIncompatible
        }), u = /* @__PURE__ */ new Map();
        c.displacements.forEach(([g, f, v], y) => u.set(y, [
          g,
          f,
          v,
          0,
          0,
          0
        ])), o.deformOutputs.val = {
          deformations: u,
          reactions: /* @__PURE__ */ new Map()
        }, o.analyzeOutputs.val = {
          solidStress: c.stressPerElement,
          solidVonMises: c.vonMisesPerElement
        }, console.log(`[CLI Modeler] Solve OK \u2014 ${w.length} solidos H8, ${L.length} nodos (${c.elapsedMs.toFixed(0)} ms)`);
      } catch (e) {
        r.errors.push(`hex8Solve: ${(e == null ? void 0 : e.message) ?? e}`);
      }
      else if (r.doSolve && L.length && w.length) try {
        window.__hekatanCliSprings = ee;
        const e = Ye({
          Dead: X,
          ...Object.fromEntries(H)
        }), p = (t) => ds(L, w, {
          ...o.nodeInputs.val,
          loads: e
        }, o.elementInputs.val, t.length ? t : void 0);
        let m = ee;
        if (window.__hekatanCliContacto = null, window.__hekatanCliContactoIter = null, se.length) {
          const t = ee.filter((f) => !Me.has(f)), c = [], u = fs(p, t, se, 60, (f, v, y) => {
            var _a2, _b2;
            const M = new Float64Array(L.length);
            for (let I = 0; I < L.length; I++) M[I] = ((_b2 = (_a2 = v.deformations) == null ? void 0 : _a2.get(I)) == null ? void 0 : _b2[2]) ?? 0;
            c.push({
              activo: [
                ...y
              ],
              uz: M
            });
          });
          window.__hekatanCliContactoIter = {
            nodos: se.map((f) => f.node),
            k: se.map((f) => f.k),
            vueltas: c
          }, o.deformOutputs.val = u.deformOutputs, m = u.springsFinales;
          const g = u.activo.filter(Boolean).length;
          window.__hekatanCliContacto = {
            convergio: u.convergio,
            iteraciones: u.iteraciones,
            historial: u.historial,
            nudosEnContacto: g,
            nudosConMuelle: se.length,
            mensaje: u.mensaje ?? null
          }, console.log(`[CLI Modeler] suelo solo compresi\xF3n: ${g}/${se.length} nudos en contacto, ${u.iteraciones} iteraciones (${u.historial.join(" \u2192 ")})${u.convergio ? "" : " \u2014 " + u.mensaje}`), u.convergio || r.errors.push(`suelo solo compresi\xF3n: ${u.mensaje}`);
        } else o.deformOutputs.val = p(ee);
        try {
          o.analyzeOutputs.val = cs(L, w, o.elementInputs.val, o.deformOutputs.val);
        } catch (t) {
          console.warn("[CLI Modeler] analyze:", (t == null ? void 0 : t.message) ?? t);
        }
        if (r.areaSprings.length > 0) try {
          const t = o.deformOutputs.val.deformations, c = o.analyzeOutputs.val ?? {}, u = c.pressure instanceof Map ? c.pressure : /* @__PURE__ */ new Map();
          let g = 0, f = 0;
          for (const v of r.areaSprings) {
            const y = T.get(v.id);
            if (y === void 0) continue;
            const I = w[y].map((S) => {
              var _a2;
              const D = ((_a2 = t.get(S)) == null ? void 0 : _a2[2]) ?? 0, $ = v.comp && we.has(v.id) ? Math.min(0, D) : D, z = v.ks * $;
              return z < g && (g = z), z > f && (f = z), z;
            });
            u.set(y, I);
          }
          u.size > 0 && (c.pressure = u, c.colorMapRanges = {
            ...c.colorMapRanges ?? {},
            pressure: [
              f,
              g
            ]
          }, o.analyzeOutputs.val = c, console.log(`[CLI Modeler] presi\xF3n Winkler: ${u.size} shells, \u03C3 ${g.toFixed(0)}..${f.toFixed(0)} kN/m\xB2`));
        } catch (t) {
          console.warn("[CLI Modeler] presi\xF3n:", (t == null ? void 0 : t.message) ?? t);
        }
        if (ne.length > 0) try {
          const t = o.deformOutputs.val.deformations, c = /* @__PURE__ */ new Map(), u = /* @__PURE__ */ new Map();
          for (const g of ne) {
            const f = w[g], v = f.map((I) => L[I]), y = f.flatMap((I) => {
              const S = t.get(I) ?? [
                0,
                0,
                0
              ];
              return [
                S[0],
                S[1],
                S[2]
              ];
            }), M = rs(v, n.get(g) ?? 25e6, Y.get(g) ?? 0.2, y, r.solidIncompatible);
            c.set(g, M.stress), u.set(g, M.vonMises);
          }
          o.analyzeOutputs.val = {
            ...o.analyzeOutputs.val ?? {},
            solidStress: c,
            solidVonMises: u
          };
        } catch (t) {
          console.warn("[CLI Modeler] tensiones de solidos:", (t == null ? void 0 : t.message) ?? t);
        }
        try {
          let t = 0;
          for (const y of e.values()) t += y[2];
          let c = 0;
          for (const y of ((_a = o.deformOutputs.val.reactions) == null ? void 0 : _a.values()) ?? []) c += y[2];
          const u = o.deformOutputs.val.deformations;
          for (const y of m) y.node >= 0 && y.dof === 2 && (c += -y.k * (((_b = u == null ? void 0 : u.get(y.node)) == null ? void 0 : _b[2]) ?? 0));
          for (const y of r.areaSprings) {
            if (we.has(y.id)) continue;
            const M = T.get(y.id);
            if (M === void 0) continue;
            const I = w[M], S = re(I.map((D) => L[D]), 1);
            I.forEach((D, $) => {
              var _a2;
              c += -y.ks * (((_a2 = u == null ? void 0 : u.get(D)) == null ? void 0 : _a2[2]) ?? 0) * S[$];
            });
          }
          const g = t + c, f = Math.max(Math.abs(t), Math.abs(c), 1e-6), v = Math.abs(g) / f * 100;
          window.__hekatanCliEquilibrio = {
            sumCargasFz: +t.toFixed(3),
            sumReaccionesFz: +(-c).toFixed(3),
            pctErr: +v.toFixed(4)
          }, v > 0.1 && ($e = `Equilibrio: \u03A3cargasFz ${t.toFixed(1)} kN vs \u03A3reaccionesFz ${(-c).toFixed(1)} kN \u2014 difieren ${v.toFixed(2)} % (> 0.1 %)`, r.errors.push($e), console.warn("[CLI Modeler] \u26A0", $e));
        } catch (t) {
          console.warn("[CLI Modeler] equilibrio:", (t == null ? void 0 : t.message) ?? t);
        }
        console.log("[CLI Modeler] Solve OK \u2014", w.length, "elementos,", L.length, "nodos");
      } catch (e) {
        r.errors.push(`solve fall\xF3: ${e.message}`);
      }
      if (o.objects3D.val = [], r.errors.length) {
        console.warn("[CLI Modeler] Errores:");
        for (const e of r.errors) console.warn("  -", e);
      }
      window.__hekatanCliErrors = r.errors;
      let Oe = 0, Be = 0;
      const Ae = o.deformOutputs.val;
      if ((_c = Ae == null ? void 0 : Ae.deformations) == null ? void 0 : _c.size) for (const [, e] of Ae.deformations) Math.abs(e[2]) > Math.abs(Oe) && (Oe = e[2]);
      if ((_d = Ae == null ? void 0 : Ae.reactions) == null ? void 0 : _d.size) for (const [, e] of Ae.reactions) Be += e[2] || 0;
      window.__hekatanCliVista = r.vista ?? null, window.__hekatanCliStats = {
        nodes: L.length,
        frames: r.frames.length,
        shells: r.shells.length,
        supports: ae.size,
        loads: X.size,
        springs: ee.length,
        solved: r.doSolve,
        errors: r.errors.length,
        maxUzMm: +(Oe * 1e3).toFixed(3),
        sumRz: +Be.toFixed(1)
      }, hs([
        xe,
        $e
      ].filter((e) => !!e));
    }
  };
});
export {
  __tla,
  xs as c,
  us as p
};
