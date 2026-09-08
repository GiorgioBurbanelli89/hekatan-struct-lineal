import { c as We, a as je } from "./cadSections-DVtTZU6U.js";
import { h as Be, a as qe, __tla as __tla_0 } from "./h8-B8y-PzF9.js";
import { a as Ne } from "./analyze-CRH7D0Bs.js";
import { d as Re, __tla as __tla_1 } from "./didacticCpp-DaEmtxPu.js";
let Qe, _e;
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
  const Ae = {
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
  function Oe(l) {
    const o = l.toLowerCase().trim();
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
    ], c = o.split(/[\s,]+/).filter(Boolean);
    if (c.length > 1 && c.length <= 6 && c.every((I) => I === "0" || I === "1")) return c.forEach((I, G) => {
      A[G] = I === "1";
    }), A;
    for (const I of c) Ae[I] !== void 0 && (A[Ae[I]] = true);
    if (/^[01]+$/.test(o) && o.length <= 6) for (let I = 0; I < o.length; I++) A[I] = o[I] === "1";
    return A;
  }
  _e = function(l) {
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
      frameEndOffsets: /* @__PURE__ */ new Map(),
      selfWeight: 0,
      meshCross: true,
      deckEtabs: false,
      deckOneWay: false,
      torsionFactor: 1,
      deckTributario: /* @__PURE__ */ new Set(),
      solids: [],
      solidIncompatible: true,
      etabsWallJoint: true,
      frameReleases: /* @__PURE__ */ new Map(),
      areaObjs: [],
      supports: /* @__PURE__ */ new Map(),
      loads: /* @__PURE__ */ new Map(),
      frameLoads: /* @__PURE__ */ new Map(),
      springs: [],
      masses: /* @__PURE__ */ new Map(),
      diaphragms: /* @__PURE__ */ new Map(),
      doSolve: false,
      errors: []
    };
    let A = null, c = 0, I = 0, G = 0;
    const C = l.split(/\r?\n/);
    for (let N = 0; N < C.length; N++) {
      let b = C[N].trim();
      if (!b || b.startsWith("#") || b.startsWith("//")) continue;
      b = b.replace(/[;]+$/, "");
      const t = b.split(/\s+/), R = t[0].toLowerCase();
      if (R === "nodes" && t.length === 1) {
        A = "nodes";
        continue;
      }
      if ((R === "elements" || R === "frames") && t.length === 1) {
        A = "elements";
        continue;
      }
      if (R === "areas" && t.length === 1) {
        A = "areas";
        continue;
      }
      if (R === "supports" && t.length === 1) {
        A = "supports";
        continue;
      }
      if (R === "loads" && t.length === 1) {
        A = "loads";
        continue;
      }
      if (R === "springs" && t.length === 1) {
        A = "springs";
        continue;
      }
      if (A && /^[\-\d]/.test(t[0])) {
        const s = t.map(parseFloat);
        if (A === "nodes" && s.length >= 3) {
          c++, o.nodes.set(c, [
            s[0],
            s[1],
            s[2]
          ]);
          continue;
        }
        if (A === "elements" && s.length >= 2) {
          I++, o.frames.push({
            id: I,
            nI: s[0] + 1,
            nJ: s[1] + 1,
            E: 25e6,
            A: 0.16,
            I: 21e-4
          });
          continue;
        }
        if (A === "areas" && s.length >= 4) {
          G++, o.shells.push({
            id: G,
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
      if (A === "supports" && /^\d/.test(t[0])) {
        const s = parseInt(t[0], 10), i = t.slice(1).join(" ");
        o.supports.set(s, Oe(i));
        continue;
      }
      A && !/^[\-\d]/.test(t[0]) && (A = null);
      try {
        switch (R) {
          case "node":
          case "n": {
            const s = parseInt(t[1], 10), i = parseFloat(t[2]), n = parseFloat(t[3]), r = parseFloat(t[4]);
            !isFinite(s) || !isFinite(i) || !isFinite(n) || !isFinite(r) ? o.errors.push(`L${N + 1}: node mal formado: ${b}`) : o.nodes.set(s, [
              i,
              n,
              r
            ]);
            break;
          }
          case "frame":
          case "beam":
          case "column":
          case "f": {
            const s = parseInt(t[1], 10), i = parseInt(t[2], 10), n = parseInt(t[3], 10), r = parseFloat(t[4] ?? "25e6"), h = parseFloat(t[5] ?? "0.16"), S = parseFloat(t[6] ?? "0.001"), E = t[7] !== void 0 ? parseFloat(t[7]) : void 0, v = t[8] !== void 0 ? parseFloat(t[8]) : void 0, $ = t[9] !== void 0 ? parseFloat(t[9]) : void 0, m = t[10] !== void 0 ? parseFloat(t[10]) : void 0, D = t[11] !== void 0 ? parseFloat(t[11]) : void 0, z = t[12] !== void 0 ? parseFloat(t[12]) : void 0, W = t.indexOf("#"), k = W >= 0 && t[W + 1] ? t[W + 1] : void 0;
            o.frames.push({
              id: s,
              nI: i,
              nJ: n,
              E: r,
              A: h,
              I: S,
              Iy: E,
              J: v,
              nu: $,
              rho: m,
              D,
              B: z,
              sec: k
            });
            break;
          }
          case "cftc": {
            const s = parseInt(t[1], 10), i = parseFloat(t[2] ?? ""), n = parseFloat(t[3] ?? ""), r = parseFloat(t[4] ?? "25e6"), h = parseFloat(t[5] ?? "0.2");
            isFinite(s) && i > 0 && n > 0 && n < i / 2 && r > 0 ? o.frameCftc.set(s, {
              D: i,
              t: n,
              Ec: r,
              nuC: isFinite(h) ? h : 0.2
            }) : o.errors.push(`cftc ${t[1]}: hace falta D t (m) y Ec (kN/m2), con t < D/2`);
            break;
          }
          case "cft": {
            const s = parseInt(t[1], 10), i = parseFloat(t[2] ?? ""), n = parseFloat(t[3] ?? ""), r = parseFloat(t[4] ?? ""), h = parseFloat(t[5] ?? "25e6"), S = parseFloat(t[6] ?? "0.2");
            isFinite(s) && i > 0 && n > 0 && r > 0 && r < Math.min(i, n) / 2 && h > 0 ? o.frameCft.set(s, {
              b: i,
              h: n,
              t: r,
              Ec: h,
              nuC: isFinite(S) ? S : 0.2
            }) : o.errors.push(`cft ${t[1]}: hace falta b h t (m) y Ec (kN/m2), con t < min(b,h)/2`);
            break;
          }
          case "as":
          case "shearareas": {
            const s = parseInt(t[1], 10), i = parseFloat(t[2] ?? "0"), n = parseFloat(t[3] ?? "0");
            isFinite(s) && isFinite(i) && isFinite(n) && o.frameShearAreas.set(s, [
              i,
              n
            ]);
            break;
          }
          case "release":
          case "rel": {
            const s = parseInt(t[1], 10), i = t.slice(2).map((r) => r.toLowerCase());
            if (!isFinite(s) || i.length === 0) {
              o.errors.push('release: se esperaba "release frameID <12 bits> | pin fix"');
              break;
            }
            const n = new Array(12).fill(false);
            if (i.length === 2 && i.every((r) => /^(pin|fix|libre|rigido)$/.test(r))) i.forEach((r, h) => {
              (r === "pin" || r === "libre") && (n[h * 6 + 4] = true, n[h * 6 + 5] = true);
            });
            else {
              const r = i.filter((h) => h === "0" || h === "1");
              if (r.length !== 12) {
                o.errors.push(`release ${s}: hacen falta 12 banderas (U1 U2 U3 R1 R2 R3 en I y en J), llegaron ${r.length}`);
                break;
              }
              for (let h = 0; h < 12; h++) n[h] = r[h] === "1";
            }
            n.some(Boolean) && o.frameReleases.set(s, n);
            break;
          }
          case "hex":
          case "solid":
          case "h8": {
            const s = parseInt(t[1], 10), i = t.slice(2, 10).map((n) => parseInt(n, 10));
            if (!isFinite(s) || i.length !== 8 || i.some((n) => !isFinite(n))) {
              o.errors.push(`hex ${t[1]}: hacen falta 8 nudos`);
              break;
            }
            o.solids.push({
              id: s,
              pts: i,
              E: parseFloat(t[10] ?? "25e6"),
              nu: parseFloat(t[11] ?? "0.2"),
              rho: parseFloat(t[12] ?? "2.45")
            });
            break;
          }
          case "incompatible": {
            const s = (t[1] ?? "1").toLowerCase();
            o.solidIncompatible = !(s === "0" || s === "no" || s === "off" || s === "false");
            break;
          }
          case "torsion":
          case "jmod": {
            const s = (t[1] ?? "safe").toLowerCase(), i = s === "safe" ? 0.1 : parseFloat(s);
            o.torsionFactor = isFinite(i) && i > 0 ? i : 1;
            break;
          }
          case "deck":
          case "deckmode": {
            const s = (t[1] ?? "etabs").toLowerCase();
            o.deckEtabs = s === "etabs" || s === "1" || s === "on" || s === "si", o.deckOneWay = t.slice(2).some((i) => /^(oneway|1way|unidireccional)$/i.test(i));
            break;
          }
          case "meshcross":
          case "meshatintersections": {
            const s = (t[1] ?? "1").toLowerCase();
            o.meshCross = !(s === "0" || s === "no" || s === "off" || s === "false");
            break;
          }
          case "etabsjoint":
          case "etabswalljoint": {
            const s = (t[1] ?? "1").toLowerCase();
            o.etabsWallJoint = !(s === "0" || s === "no" || s === "off" || s === "false");
            break;
          }
          case "selfweight":
          case "peso":
          case "sw": {
            const s = parseFloat(t[1] ?? "1");
            o.selfWeight = isFinite(s) ? s : 1;
            break;
          }
          case "endoffset":
          case "offset":
          case "lengthoff": {
            const s = parseInt(t[1], 10), i = parseFloat(t[2] ?? "0"), n = parseFloat(t[3] ?? "0"), r = parseFloat(t[4] ?? "0");
            if (!isFinite(s) || !isFinite(i) || !isFinite(n)) {
              o.errors.push('endoffset: se esperaba "endoffset frameID offI offJ [rz]"');
              break;
            }
            o.frameEndOffsets.set(s, [
              i,
              n,
              isFinite(r) ? r : 0
            ]);
            break;
          }
          case "ang":
          case "localaxis": {
            const s = parseInt(t[1], 10), i = parseFloat(t[2] ?? "0");
            isFinite(s) && isFinite(i) && o.frameAngles.set(s, i);
            break;
          }
          case "shell":
          case "plate":
          case "s": {
            const s = parseInt(t[1], 10), i = [
              parseInt(t[2], 10),
              parseInt(t[3], 10),
              parseInt(t[4], 10),
              parseInt(t[5], 10)
            ], n = parseFloat(t[6] ?? "0.20"), r = parseFloat(t[7] ?? "25e6"), h = t[9] !== void 0 ? parseFloat(t[9]) : void 0, S = h !== void 0 && isFinite(h) ? h : void 0;
            if (o.shells.push({
              id: s,
              pts: i,
              t: n,
              E: r,
              rho: S
            }), t[8] !== void 0) {
              const E = parseFloat(t[8]);
              isFinite(E) && E !== 0 && o.shellLoads.set(s, E);
            }
            break;
          }
          case "shelltype":
          case "plateform": {
            const s = parseInt(t[1], 10), i = (t[2] ?? "").toLowerCase();
            if (!isFinite(s)) break;
            let n;
            if (i === "thin" || i === "delgada" || i === "kirchhoff" || i === "1" ? n = 1 : (i === "thick" || i === "gruesa" || i === "mindlin" || i === "0") && (n = 0), n === void 0) {
              o.errors.push(`shelltype ${s}: se esperaba thin o thick`);
              break;
            }
            o.shellTypes.set(s, n);
            break;
          }
          case "shellmod": {
            const s = parseInt(t[1], 10);
            if (!isFinite(s)) break;
            const i = t.slice(2).map(parseFloat);
            if (i.length >= 8) o.shellModsDir.set(s, i.slice(0, 8).map((n) => isFinite(n) ? n : 1));
            else {
              const n = i[0], r = i[1];
              o.shellMods.set(s, [
                isFinite(n) ? n : 1,
                isFinite(r) ? r : 1
              ]);
            }
            break;
          }
          case "areaobj": {
            const s = t.slice(1).map((m) => parseInt(m, 10));
            if (s.length < 7 || s.some((m) => !isFinite(m))) {
              o.errors.push('areaobj: se esperaba "areaobj ID n1 n2 n3 n4 desdeShell hastaShell"');
              break;
            }
            const [i, n, r, h, S, E, v] = s, $ = [];
            for (let m = E; m <= v; m++) $.push(m);
            o.areaObjs.push({
              id: i,
              pts: [
                n,
                r,
                h,
                S
              ],
              cells: $
            });
            break;
          }
          case "shellang": {
            const s = parseInt(t[1], 10), i = parseFloat(t[2]);
            if (!isFinite(s) || !isFinite(i)) {
              o.errors.push('shellang: se esperaba "shellang shellID grados"');
              break;
            }
            o.shellAngles.set(s, i);
            break;
          }
          case "areaload":
          case "qarea": {
            const s = parseInt(t[1], 10), i = parseFloat(t[2]);
            if (!isFinite(s) || !isFinite(i)) {
              o.errors.push('areaload: se esperaba "areaload shellID q"');
              break;
            }
            o.shellLoads.set(s, i);
            break;
          }
          case "support":
          case "fix": {
            const s = parseInt(t[1], 10), i = t.slice(2).join(" ");
            o.supports.set(s, Oe(i));
            break;
          }
          case "load":
          case "l": {
            const s = parseInt(t[1], 10), i = parseFloat(t[2] ?? "0"), n = parseFloat(t[3] ?? "0"), r = parseFloat(t[4] ?? "0"), h = parseFloat(t[5] ?? "0"), S = parseFloat(t[6] ?? "0"), E = parseFloat(t[7] ?? "0");
            o.loads.set(s, [
              i,
              n,
              r,
              h,
              S,
              E
            ]);
            break;
          }
          case "frameload":
          case "fl": {
            const s = parseInt(t[1], 10), i = parseFloat(t[2] ?? "0"), n = parseFloat(t[3] ?? "0"), r = parseFloat(t[4] ?? "0"), h = o.frameLoads.get(s) ?? [
              0,
              0,
              0
            ];
            o.frameLoads.set(s, [
              h[0] + i,
              h[1] + n,
              h[2] + r
            ]);
            break;
          }
          case "spring": {
            const s = parseInt(t[1], 10), i = (t[2] ?? "uz").toLowerCase(), n = Ae[i] ?? 2, r = parseFloat(t[3] ?? "1000");
            o.springs.push({
              node: s,
              dof: n,
              k: r
            });
            break;
          }
          case "diaph":
          case "diaphragm": {
            const s = parseInt(t[1], 10), i = parseInt(t[2] ?? "1", 10);
            isFinite(s) && isFinite(i) && i > 0 && o.diaphragms.set(s, i);
            break;
          }
          case "mass": {
            const s = parseInt(t[1], 10), i = parseFloat(t[2] ?? "0");
            Number.isFinite(s) && Number.isFinite(i) ? o.masses.set(s, (o.masses.get(s) ?? 0) + i) : o.errors.push(`L${N + 1}: mass necesita <nudo> <toneladas>`);
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
            o.errors.push(`L${N + 1}: comando desconocido "${R}"`);
        }
      } catch (s) {
        o.errors.push(`L${N + 1}: error "${b}" \u2014 ${s.message}`);
      }
    }
    return o;
  };
  const Ue = `# CLI Modeler \u2014 escrib\xED comandos para construir un modelo
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
`, q = (l, o) => [
    l[0] - o[0],
    l[1] - o[1],
    l[2] - o[2]
  ], le = (l, o) => l[0] * o[0] + l[1] * o[1] + l[2] * o[2], pe = (l, o) => [
    l[1] * o[2] - l[2] * o[1],
    l[2] * o[0] - l[0] * o[2],
    l[0] * o[1] - l[1] * o[0]
  ], P = (l) => Math.hypot(l[0], l[1], l[2]), oe = (l, o) => [
    l[0] * o,
    l[1] * o,
    l[2] * o
  ];
  function ze(l, o) {
    const A = l.shellModsDir.get(o);
    return !!A && Math.abs(A[3]) < 1e-12 && Math.abs(A[4]) < 1e-12 && Math.abs(A[5]) < 1e-12;
  }
  function Ge(l, o = 200, A) {
    const c = [
      0,
      1,
      2
    ].map((v) => (l[0][v] + l[1][v] + l[2][v] + l[3][v]) / 4);
    let I = q(l[1], l[0]), G = pe(I, q(l[3], l[0]));
    G = oe(G, 1 / P(G)), I = oe(I, 1 / P(I));
    const C = pe(G, I), N = l.map((v) => [
      le(q(v, c), I),
      le(q(v, c), C)
    ]);
    let b = [
      0,
      1,
      2,
      3
    ];
    if (A) {
      const v = [
        0,
        1,
        2,
        3
      ].map(($) => {
        const m = q(l[($ + 1) % 4], l[$]);
        return Math.abs(le(m, A)) / P(m);
      });
      b = [
        0,
        1,
        2,
        3
      ].sort(($, m) => v[$] - v[m]).slice(0, 2);
    }
    const t = N.map((v) => v[0]), R = N.map((v) => v[1]), s = Math.min(...t), i = Math.max(...t), n = Math.min(...R), r = Math.max(...R), h = [
      0,
      1,
      2,
      3
    ].map(() => ({
      pts: [],
      dA: 0
    }));
    let S = 0;
    for (let v = 0; v < o; v++) for (let $ = 0; $ < o; $++) {
      const m = s + (i - s) * (v + 0.5) / o, D = n + (r - n) * ($ + 0.5) / o;
      let z = 0, W = 0;
      for (let T = 0; T < 4; T++) {
        const j = N[T], V = N[(T + 1) % 4];
        (V[0] - j[0]) * (D - j[1]) - (V[1] - j[1]) * (m - j[0]) >= 0 ? z++ : W++;
      }
      if (z !== 4 && W !== 4) continue;
      let k = b[0], O = 1 / 0;
      for (const T of b) {
        const j = N[T], V = N[(T + 1) % 4], _ = V[0] - j[0], X = V[1] - j[1], de = _ * _ + X * X, ne = Math.max(0, Math.min(1, ((m - j[0]) * _ + (D - j[1]) * X) / de)), Y = Math.hypot(m - (j[0] + ne * _), D - (j[1] + ne * X));
        Y < O && (O = Y, k = T);
      }
      h[k].pts.push([
        c[0] + m * I[0] + D * C[0],
        c[1] + m * I[1] + D * C[1],
        c[2] + m * I[2] + D * C[2]
      ]), S++;
    }
    const E = 0.5 * P(pe(q(l[2], l[0]), q(l[3], l[1])));
    for (const v of h) v.dA = S ? E / S : 0;
    return h;
  }
  function Xe(l) {
    const A = (n) => l.nodes.get(n), c = [
      ...l.nodes.keys()
    ], I = (n, r, h) => {
      const S = q(r, n), E = P(S), v = oe(S, 1 / E), $ = [];
      for (const m of c) {
        if (h.includes(m)) continue;
        const D = q(A(m), n), z = le(D, v);
        z > 1e-6 && z < E - 1e-6 && P(q(D, oe(v, z))) < 1e-4 && $.push(z / E);
      }
      return $.sort((m, D) => m - D);
    }, G = (n, r) => {
      const h = [];
      for (const S of n) r.some((E) => Math.abs(S - E) < 1e-5) && !h.some((E) => Math.abs(S - E) < 1e-5) && h.push(S);
      return h;
    }, C = (n) => {
      for (const r of c) if (P(q(A(r), n)) < 1e-4) return r;
    };
    let N = l.shells.reduce((n, r) => Math.max(n, r.id), 0) + 1;
    const b = [], t = (n, r) => {
      const h = l.shellModsDir.get(n);
      h && l.shellModsDir.set(r, [
        ...h
      ]);
      const S = l.shellMods.get(n);
      S && l.shellMods.set(r, [
        ...S
      ]);
      const E = l.shellLoads.get(n);
      E !== void 0 && l.shellLoads.set(r, E);
      const v = l.shellTypes.get(n);
      v !== void 0 && l.shellTypes.set(r, v);
      const $ = l.shellAngles.get(n);
      $ !== void 0 && l.shellAngles.set(r, $);
    };
    for (const n of l.shells) {
      if (!ze(l, n.id) || n.pts.length !== 4 || n.pts.some((k) => !l.nodes.has(k))) {
        b.push(n);
        continue;
      }
      const r = n.pts.map(A), h = I(r[0], r[1], n.pts), S = I(r[2], r[3], n.pts).map((k) => 1 - k), E = I(r[1], r[2], n.pts), v = I(r[3], r[0], n.pts).map((k) => 1 - k);
      let $ = [
        0,
        ...G(h, S),
        1
      ], m = [
        0,
        ...G(E, v),
        1
      ];
      if ($.length === 2 && m.length === 2) {
        b.push(n);
        continue;
      }
      const D = (k, O) => [
        0,
        1,
        2
      ].map((T) => (1 - k) * (1 - O) * r[0][T] + k * (1 - O) * r[1][T] + k * O * r[2][T] + (1 - k) * O * r[3][T]);
      let z = m.map((k) => $.map((O) => C(D(O, k))));
      if (z.some((k) => k.some((O) => O === void 0)) && ($.length >= m.length ? m = [
        0,
        1
      ] : $ = [
        0,
        1
      ], z = m.map((k) => $.map((O) => C(D(O, k)))), z.some((k) => k.some((O) => O === void 0)))) {
        b.push(n);
        continue;
      }
      let W = true;
      for (let k = 0; k < m.length - 1; k++) for (let O = 0; O < $.length - 1; O++) {
        const T = [
          z[k][O],
          z[k][O + 1],
          z[k + 1][O + 1],
          z[k + 1][O]
        ], j = W ? n.id : N++;
        W || t(n.id, j), W = false, b.push({
          id: j,
          pts: T,
          t: n.t,
          E: n.E,
          rho: n.rho
        });
      }
    }
    l.shells = b;
    const R = 9.80665, s = (n, r) => {
      const h = l.loads.get(n) ?? [
        0,
        0,
        0,
        0,
        0,
        0
      ];
      l.loads.set(n, [
        h[0] + r[0],
        h[1] + r[1],
        h[2] + r[2],
        h[3] + r[3],
        h[4] + r[4],
        h[5] + r[5]
      ]);
    }, i = (n, r) => {
      const h = q(r, n), S = P(h), E = oe(h, 1 / S);
      return l.frames.filter((v) => [
        v.nI,
        v.nJ
      ].every(($) => {
        const m = l.nodes.get($);
        if (!m) return false;
        const D = q(m, n), z = le(D, E);
        return z > -1e-4 && z < S + 1e-4 && P(q(D, oe(E, z))) < 1e-4;
      }));
    };
    for (const n of l.shells) {
      if (!ze(l, n.id) || n.pts.length !== 4) continue;
      const r = l.selfWeight ? (n.rho ?? 2.45) * n.t * R * l.selfWeight : 0, h = l.shellLoads.get(n.id) ?? 0, S = -r + h;
      if (Math.abs(S) < 1e-15) continue;
      const E = n.pts.map(A);
      let v;
      if (l.deckOneWay) {
        const m = q(E[1], E[0]);
        let D = pe(m, q(E[3], E[0]));
        D = oe(D, 1 / P(D));
        const z = oe(m, 1 / P(m)), W = pe(D, z), k = (l.shellAngles.get(n.id) ?? 0) * Math.PI / 180;
        v = [
          0,
          1,
          2
        ].map((O) => Math.cos(k) * z[O] + Math.sin(k) * W[O]);
      }
      const $ = Ge(E, 200, v);
      for (let m = 0; m < 4; m++) {
        const { pts: D, dA: z } = $[m];
        if (!D.length) continue;
        const W = E[m], k = E[(m + 1) % 4], O = i(W, k);
        if (!O.length) {
          const X = S * z * D.length;
          s(n.pts[m], [
            0,
            0,
            X / 2,
            0,
            0,
            0
          ]), s(n.pts[(m + 1) % 4], [
            0,
            0,
            X / 2,
            0,
            0,
            0
          ]);
          continue;
        }
        const T = q(k, W), j = P(T), V = oe(T, 1 / j), _ = D.map((X) => le(q(X, W), V));
        for (const X of O) {
          const de = A(X.nI), ne = A(X.nJ), Y = le(q(de, W), V), he = le(q(ne, W), V), ee = Math.min(Y, he), K = Math.max(Y, he), se = K - ee;
          if (se < 1e-9) continue;
          const ue = K >= j - 1e-6, Ie = oe(q(ne, de), 1 / se), ae = pe(Ie, [
            0,
            0,
            1
          ]);
          let me = 0, ce = 0, ge = 0, ie = 0;
          for (const d of _) {
            if (d < ee - 1e-9 || (ue ? d > K + 1e-9 : d >= K - 1e-9)) continue;
            let f = d - ee;
            Y > he && (f = se - f);
            const a = f / se;
            me += 1 - 3 * a * a + 2 * a * a * a, ce += se * (a - 2 * a * a + a * a * a), ge += 3 * a * a - 2 * a * a * a, ie += se * (-a * a + a * a * a);
          }
          const e = S * z;
          s(X.nI, [
            0,
            0,
            e * me,
            ae[0] * e * ce,
            ae[1] * e * ce,
            ae[2] * e * ce
          ]), s(X.nJ, [
            0,
            0,
            e * ge,
            ae[0] * e * ie,
            ae[1] * e * ie,
            ae[2] * e * ie
          ]);
        }
      }
      l.deckTributario.add(n.id), l.shellLoads.delete(n.id);
    }
  }
  Qe = {
    id: "cli-modeler",
    name: "CLI Modeler (comandos)",
    category: "\u{1F9EA} Utilidades",
    defaultShellResult: "none",
    availableShellResults: [],
    params: {},
    build(l, o) {
      var _a, _b;
      const A = window.__hekatanCliScript ?? Ue;
      window.__hekatanCliLastScript = A;
      const c = _e(A);
      c.deckEtabs && Xe(c);
      const I = /* @__PURE__ */ new Map(), G = /* @__PURE__ */ new Map(), C = [], N = Array.from(c.nodes.keys()).sort((e, d) => e - d);
      for (const e of N) I.set(e, C.length), C.push(c.nodes.get(e));
      const b = [], t = /* @__PURE__ */ new Map(), R = /* @__PURE__ */ new Map(), s = /* @__PURE__ */ new Map(), i = /* @__PURE__ */ new Map(), n = /* @__PURE__ */ new Map(), r = /* @__PURE__ */ new Map(), h = /* @__PURE__ */ new Map(), S = /* @__PURE__ */ new Map(), E = /* @__PURE__ */ new Map(), v = /* @__PURE__ */ new Map(), $ = /* @__PURE__ */ new Map(), m = /* @__PURE__ */ new Map(), D = /* @__PURE__ */ new Map(), z = /* @__PURE__ */ new Map(), W = /* @__PURE__ */ new Map(), k = /* @__PURE__ */ new Map(), O = /* @__PURE__ */ new Map(), T = /* @__PURE__ */ new Map(), j = /* @__PURE__ */ new Map();
      for (const e of c.frames) {
        const d = I.get(e.nI), f = I.get(e.nJ);
        if (d === void 0 || f === void 0) {
          const F = N.length ? `IDs disponibles: ${N.join(", ")}` : "ning\xFAn nodo definido", J = [];
          d === void 0 && J.push(e.nI), f === void 0 && J.push(e.nJ), c.errors.push(`frame ${e.id}: nodo(s) inexistente(s) [${J.join(", ")}] \u2014 ${F}`);
          continue;
        }
        const a = b.length;
        b.push([
          d,
          f
        ]);
        const w = e.nu ?? 0.2;
        t.set(a, e.E), R.set(a, e.E / (2 * (1 + w))), s.set(a, e.A), i.set(a, e.I), n.set(a, e.Iy ?? e.I), r.set(a, e.J ?? 0.14 * Math.pow(Math.sqrt(e.A), 4)), h.set(a, e.rho ?? 2.45), T.set(a, w), e.D !== void 0 && isFinite(e.D) && S.set(a, e.D), e.B !== void 0 && isFinite(e.B) && E.set(a, e.B);
        const M = c.frameAngles.get(e.id);
        M !== void 0 && isFinite(M) && $.set(a, M);
        const u = c.frameReleases.get(e.id);
        u && m.set(a, u);
        const p = c.frameEndOffsets.get(e.id);
        p && D.set(a, p);
        const L = c.frameLoads.get(e.id);
        L && W.set(a, L);
        const y = c.frameShearAreas.get(e.id);
        if (y && (O.set(a, y[0]), k.set(a, y[1])), e.sec || e.D !== void 0 && e.B !== void 0) {
          const F = {
            type: "general"
          };
          e.sec && (F.name = e.sec), e.D !== void 0 && isFinite(e.D) && (F.h = e.D), e.B !== void 0 && isFinite(e.B) && (F.b = e.B), v.set(a, F);
        }
        const g = c.frameCftc.get(e.id);
        if (g) {
          const F = We(g.D, g.t, e.E, w, g.Ec, g.nuC);
          s.set(a, F.A), n.set(a, F.Iz), i.set(a, F.Iy), r.set(a, F.J), O.set(a, F.As2), k.set(a, F.As3), S.set(a, g.D), E.set(a, g.D), v.set(a, {
            type: "CFT",
            d: g.D,
            tw: g.t,
            fillE: g.Ec,
            name: e.sec ?? `CFTC ${Math.round(g.D * 1e3)}X${Math.round(g.t * 1e3)}`
          });
        }
        const x = c.frameCft.get(e.id);
        if (x) {
          const F = je(x.b, x.h, x.t, e.E, w, x.Ec, x.nuC);
          s.set(a, F.A), n.set(a, F.Iz), i.set(a, F.Iy), r.set(a, F.J), O.set(a, F.As2), k.set(a, F.As3), S.set(a, x.h), E.set(a, x.b), v.set(a, {
            type: "CFT",
            b: x.b,
            h: x.h,
            tw: x.t,
            fillE: x.Ec,
            name: e.sec ?? `CFT ${Math.round(x.h * 1e3)}X${Math.round(x.b * 1e3)}X${Math.round(x.t * 1e3)}`
          });
        }
      }
      if (c.meshCross) {
        const e = (u, p) => u[0] * p[0] + u[1] * p[1] + u[2] * p[2], d = [
          t,
          R,
          s,
          i,
          n,
          r,
          h,
          T,
          S,
          E,
          $,
          k,
          O,
          v,
          W
        ], f = (u, p) => {
          for (const L of d) L.has(u) && L.set(p, L.get(u));
        }, a = (u) => {
          for (let p = 0; p < C.length; p++) if (Math.hypot(C[p][0] - u[0], C[p][1] - u[1], C[p][2] - u[2]) < 1e-6) return p;
          return C.push([
            u[0],
            u[1],
            u[2]
          ]), C.length - 1;
        }, w = (u) => {
          const p = C[u[0]], L = C[u[1]];
          return [
            Math.min(p[0], L[0]),
            Math.min(p[1], L[1]),
            Math.min(p[2], L[2]),
            Math.max(p[0], L[0]),
            Math.max(p[1], L[1]),
            Math.max(p[2], L[2])
          ];
        };
        let M = 0;
        for (let u = 0; u < b.length; u++) {
          if (b[u].length !== 2) continue;
          const p = w(b[u]);
          for (let L = u + 1; L < b.length; L++) {
            if (b[L].length !== 2) continue;
            const [y, g] = b[u], [x, F] = b[L];
            if (y === x || y === F || g === x || g === F) continue;
            const J = w(b[L]);
            if (p[0] > J[3] + 1e-6 || J[0] > p[3] + 1e-6 || p[1] > J[4] + 1e-6 || J[1] > p[4] + 1e-6 || p[2] > J[5] + 1e-6 || J[2] > p[5] + 1e-6) continue;
            const B = C[y], H = C[g], U = C[x], te = C[F], Q = [
              H[0] - B[0],
              H[1] - B[1],
              H[2] - B[2]
            ], Z = [
              te[0] - U[0],
              te[1] - U[1],
              te[2] - U[2]
            ], re = [
              B[0] - U[0],
              B[1] - U[1],
              B[2] - U[2]
            ], xe = e(Q, Q), ve = e(Q, Z), ye = e(Z, Z), Se = e(Q, re), De = e(Z, re), ke = xe * ye - ve * ve;
            if (ke < 1e-10 * xe * ye) continue;
            const Me = (ve * De - ye * Se) / ke, be = (xe * De - ve * Se) / ke;
            if (Me < 1e-6 || Me > 1 - 1e-6 || be < 1e-6 || be > 1 - 1e-6) continue;
            const we = [
              B[0] + Me * Q[0],
              B[1] + Me * Q[1],
              B[2] + Me * Q[2]
            ], Le = [
              U[0] + be * Z[0],
              U[1] + be * Z[1],
              U[2] + be * Z[2]
            ];
            if (Math.hypot(we[0] - Le[0], we[1] - Le[1], we[2] - Le[2]) > 1e-6) continue;
            const $e = a(we);
            for (const fe of [
              u,
              L
            ]) {
              const [Te, Je] = b[fe], Ee = b.length;
              b[fe] = [
                Te,
                $e
              ], b.push([
                $e,
                Je
              ]), f(fe, Ee);
              const Ce = m.get(fe);
              Ce && (m.set(fe, [
                ...Ce.slice(0, 6),
                ...Array(6).fill(false)
              ]), m.set(Ee, [
                ...Array(6).fill(false),
                ...Ce.slice(6)
              ]));
              const Fe = D.get(fe);
              Fe && (D.set(fe, [
                Fe[0],
                0,
                Fe[2]
              ]), D.set(Ee, [
                0,
                Fe[1],
                Fe[2]
              ]));
            }
            M++;
          }
        }
        M > 0 && console.log(`[CLI Modeler] ${M} cruces de barras partidos con nudo (como ETABS; meshcross 0 lo apaga)`);
      }
      for (const e of c.shells) {
        const d = e.pts.map((w) => I.get(w));
        if (d.some((w) => w === void 0)) {
          c.errors.push(`shell ${e.id}: algun nodo inexistente`);
          continue;
        }
        const f = b.length;
        G.set(e.id, f), b.push(d), t.set(f, e.E), R.set(f, e.E / (2 * 1.2)), j.set(f, e.t), h.set(f, e.rho ?? 2.45), T.set(f, 0.2);
        const a = c.shellTypes.get(e.id);
        a !== void 0 && z.set(f, a);
      }
      const V = /* @__PURE__ */ new Map();
      for (const [e, d] of c.supports.entries()) {
        const f = I.get(e);
        f !== void 0 && V.set(f, d);
      }
      const _ = /* @__PURE__ */ new Map();
      for (const [e, d] of c.loads.entries()) {
        const f = I.get(e);
        f !== void 0 && _.set(f, [
          ...d
        ]);
      }
      const X = /* @__PURE__ */ new Map();
      for (const [e, d] of c.diaphragms.entries()) {
        const f = I.get(e);
        f !== void 0 && X.set(f, d);
      }
      const de = /* @__PURE__ */ new Map();
      for (const [e, d] of c.masses.entries()) {
        const f = I.get(e);
        f !== void 0 && de.set(f, d);
      }
      if (c.frameLoads.size) {
        const e = (d, f) => {
          const a = _.get(d) ?? [
            0,
            0,
            0,
            0,
            0,
            0
          ];
          _.set(d, [
            a[0] + f[0],
            a[1] + f[1],
            a[2] + f[2],
            a[3] + f[3],
            a[4] + f[4],
            a[5] + f[5]
          ]);
        };
        for (const [d, f] of c.frameLoads.entries()) {
          const a = c.frames.find((J) => J.id === d);
          if (!a) {
            c.errors.push(`frameload ${d}: no existe esa barra`);
            continue;
          }
          const w = I.get(a.nI), M = I.get(a.nJ);
          if (w === void 0 || M === void 0) continue;
          const u = C[w], p = C[M], L = [
            p[0] - u[0],
            p[1] - u[1],
            p[2] - u[2]
          ], y = Math.hypot(L[0], L[1], L[2]);
          if (y < 1e-9) continue;
          const g = [
            L[0] / y,
            L[1] / y,
            L[2] / y
          ], x = y * y / 12, F = [
            g[1] * f[2] - g[2] * f[1],
            g[2] * f[0] - g[0] * f[2],
            g[0] * f[1] - g[1] * f[0]
          ];
          e(w, [
            f[0] * y / 2,
            f[1] * y / 2,
            f[2] * y / 2,
            x * F[0],
            x * F[1],
            x * F[2]
          ]), e(M, [
            f[0] * y / 2,
            f[1] * y / 2,
            f[2] * y / 2,
            -x * F[0],
            -x * F[1],
            -x * F[2]
          ]);
        }
      }
      const ne = /* @__PURE__ */ new Map(), Y = 1 / Math.sqrt(3), he = [
        [
          -Y,
          -Y
        ],
        [
          Y,
          -Y
        ],
        [
          Y,
          Y
        ],
        [
          -Y,
          Y
        ]
      ];
      for (const e of c.shells) {
        const d = c.shellLoads.get(e.id);
        if (!d || c.deckTributario.has(e.id)) continue;
        const f = e.pts.map((M) => I.get(M));
        if (f.some((M) => M === void 0)) {
          c.errors.push(`areaload ${e.id}: algun nodo inexistente`);
          continue;
        }
        const a = f.map((M) => C[M]), w = [
          0,
          0,
          0,
          0
        ];
        for (const [M, u] of he) {
          const p = [
            0.25 * (1 - M) * (1 - u),
            0.25 * (1 + M) * (1 - u),
            0.25 * (1 + M) * (1 + u),
            0.25 * (1 - M) * (1 + u)
          ], L = [
            -0.25 * (1 - u),
            0.25 * (1 - u),
            0.25 * (1 + u),
            -0.25 * (1 + u)
          ], y = [
            -0.25 * (1 - M),
            -0.25 * (1 + M),
            0.25 * (1 + M),
            0.25 * (1 - M)
          ], g = [
            0,
            1,
            2
          ].map((B) => L.reduce((H, U, te) => H + U * a[te][B], 0)), x = [
            0,
            1,
            2
          ].map((B) => y.reduce((H, U, te) => H + U * a[te][B], 0)), F = [
            g[1] * x[2] - g[2] * x[1],
            g[2] * x[0] - g[0] * x[2],
            g[0] * x[1] - g[1] * x[0]
          ], J = Math.hypot(F[0], F[1], F[2]);
          for (let B = 0; B < 4; B++) w[B] += p[B] * d * J;
        }
        for (let M = 0; M < 4; M++) {
          const u = f[M], p = _.get(u) ?? [
            0,
            0,
            0,
            0,
            0,
            0
          ];
          p[2] += w[M], _.set(u, p), ne.set(u, (ne.get(u) ?? 0) + w[M]);
        }
      }
      if (c.selfWeight) {
        const d = /* @__PURE__ */ new Set();
        for (const [a, w] of G) c.deckTributario.has(a) && d.add(w);
        const f = (a, w) => {
          const M = _.get(a) ?? [
            0,
            0,
            0,
            0,
            0,
            0
          ];
          M[2] += w, _.set(a, M);
        };
        b.forEach((a, w) => {
          const M = h.get(w) ?? 0;
          if (M && !d.has(w)) {
            if (a.length === 2) {
              const u = s.get(w) ?? 0, p = C[a[0]], L = C[a[1]], y = [
                L[0] - p[0],
                L[1] - p[1],
                L[2] - p[2]
              ];
              let g = Math.hypot(y[0], y[1], y[2]);
              const x = D.get(w);
              if (x) {
                const Q = Math.hypot(y[0], y[1]);
                Q > 1e-9 && Math.abs(Math.atan2(Math.abs(y[2]), Q)) * 180 / Math.PI < 20 && (g = Math.max(g - x[0] - x[1], 0));
              }
              const F = Math.hypot(y[0], y[1], y[2]), J = -u * M * 9.80665 * c.selfWeight, B = [
                y[0] / F,
                y[1] / F,
                y[2] / F
              ], H = g * g / 12, U = [
                B[1] * J,
                -B[0] * J,
                0
              ], te = (Q, Z) => {
                const re = _.get(Q) ?? [
                  0,
                  0,
                  0,
                  0,
                  0,
                  0
                ];
                _.set(Q, [
                  re[0] + Z[0],
                  re[1] + Z[1],
                  re[2] + Z[2],
                  re[3] + Z[3],
                  re[4] + Z[4],
                  re[5] + Z[5]
                ]);
              };
              te(a[0], [
                0,
                0,
                J * g / 2,
                H * U[0],
                H * U[1],
                0
              ]), te(a[1], [
                0,
                0,
                J * g / 2,
                -H * U[0],
                -H * U[1],
                0
              ]);
            } else if (a.length === 4) {
              const u = j.get(w) ?? 0, p = a.map((g) => C[g]);
              let L = 0;
              for (let g = 1; g < 3; g++) {
                const x = [
                  p[g][0] - p[0][0],
                  p[g][1] - p[0][1],
                  p[g][2] - p[0][2]
                ], F = [
                  p[g + 1][0] - p[0][0],
                  p[g + 1][1] - p[0][1],
                  p[g + 1][2] - p[0][2]
                ], J = [
                  x[1] * F[2] - x[2] * F[1],
                  x[2] * F[0] - x[0] * F[2],
                  x[0] * F[1] - x[1] * F[0]
                ];
                L += Math.hypot(J[0], J[1], J[2]) / 2;
              }
              const y = L * u * M * 9.80665 * c.selfWeight;
              for (const g of a) f(g, -y / 4);
            }
          }
        });
      }
      const ee = [];
      for (const e of c.springs) {
        const d = I.get(e.node);
        d !== void 0 && ee.push({
          node: d,
          dof: e.dof,
          k: e.k
        });
      }
      const K = [];
      for (const e of c.solids) {
        const d = e.pts.map((a) => I.get(a));
        if (d.some((a) => a === void 0)) {
          c.errors.push(`hex ${e.id}: algun nodo inexistente`);
          continue;
        }
        const f = b.length;
        b.push(d), t.set(f, e.E), T.set(f, e.nu), R.set(f, e.E / (2 * (1 + e.nu))), h.set(f, e.rho), K.push(f);
      }
      o.nodes.val = C, o.elements.val = b, o.nodeInputs.val = {
        supports: V,
        loads: _,
        masses: de,
        diaphragms: X,
        springs: ee
      }, o.springs && (o.springs.val = ee);
      const se = /* @__PURE__ */ new Map(), ue = /* @__PURE__ */ new Map(), Ie = /* @__PURE__ */ new Map(), ae = /* @__PURE__ */ new Map(), me = /* @__PURE__ */ new Map();
      for (const e of c.shells) {
        const d = G.get(e.id);
        if (d === void 0) continue;
        const f = c.shellLoads.get(e.id);
        f !== void 0 && ae.set(d, f);
        const a = c.shellAngles.get(e.id);
        a !== void 0 && me.set(d, a);
        const w = c.shellModsDir.get(e.id);
        if (w) {
          Ie.set(d, w), se.set(d, (w[0] + w[1]) / 2), ue.set(d, (w[3] + w[4]) / 2);
          continue;
        }
        const M = c.shellMods.get(e.id);
        M && (se.set(d, M[0]), ue.set(d, M[1]));
      }
      if (o.elementInputs.val = {
        elasticities: t,
        shearModuli: R,
        areas: s,
        momentsOfInertiaY: i,
        momentsOfInertiaZ: n,
        torsionalConstants: c.torsionFactor !== 1 ? new Map([
          ...r
        ].map(([e, d]) => [
          e,
          d * c.torsionFactor
        ])) : r,
        densities: h,
        poissonsRatios: T,
        thicknesses: j,
        membraneModifiers: se,
        bendingModifiers: ue,
        shellModifiers: Ie,
        shellSurfaceLoads: ae,
        shellAngles: me,
        cargaDeArea: ne,
        cantos: S,
        anchos: E,
        sectionShapes: v,
        localAngles: $,
        shearAreasY: k,
        shearAreasZ: O,
        momentReleases: m,
        endOffsets: D,
        plateFormulations: z,
        frameLoads: W,
        meshAtIntersections: c.meshCross,
        solidIncompatible: c.solidIncompatible,
        selfWeight: c.selfWeight,
        etabsWallJoint: c.etabsWallJoint,
        areaObjects: c.areaObjs.map((e) => ({
          nodes: e.pts.map((d) => I.get(d)).filter((d) => d !== void 0),
          cells: e.cells.map((d) => G.get(d)).filter((d) => d !== void 0),
          q: e.cells.map((d) => c.shellLoads.get(d)).find((d) => d !== void 0),
          ang: e.cells.map((d) => c.shellAngles.get(d)).find((d) => d !== void 0)
        })).filter((e) => e.nodes.length === 4 && e.cells.length > 0)
      }, c.doSolve && K.length > 0 && K.length === b.length) try {
        const e = t.get(K[0]) ?? 25e6, d = T.get(K[0]) ?? 0.2;
        K.some((u) => Math.abs((t.get(u) ?? e) - e) > 1e-9 * e || Math.abs((T.get(u) ?? d) - d) > 1e-12) && c.errors.push("hex: hex8Solve lleva UN material; los solidos tienen E o nu distintos y se usa el del primero");
        const f = /* @__PURE__ */ new Map();
        for (const [u, p] of o.nodeInputs.val.supports ?? []) f.set(u, [
          !!p[0],
          !!p[1],
          !!p[2]
        ]);
        const a = /* @__PURE__ */ new Map();
        for (const [u, p] of o.nodeInputs.val.loads ?? []) a.set(u, [
          p[0] ?? 0,
          p[1] ?? 0,
          p[2] ?? 0
        ]);
        const w = Be({
          nodes: C,
          elements: b,
          E: e,
          nu: d,
          supports: f,
          loads: a,
          incompatible: c.solidIncompatible
        }), M = /* @__PURE__ */ new Map();
        w.displacements.forEach(([u, p, L], y) => M.set(y, [
          u,
          p,
          L,
          0,
          0,
          0
        ])), o.deformOutputs.val = {
          deformations: M,
          reactions: /* @__PURE__ */ new Map()
        }, o.analyzeOutputs.val = {
          solidStress: w.stressPerElement,
          solidVonMises: w.vonMisesPerElement
        }, console.log(`[CLI Modeler] Solve OK \u2014 ${b.length} solidos H8, ${C.length} nodos (${w.elapsedMs.toFixed(0)} ms)`);
      } catch (e) {
        c.errors.push(`hex8Solve: ${(e == null ? void 0 : e.message) ?? e}`);
      }
      else if (c.doSolve && C.length && b.length) try {
        o.deformOutputs.val = Re(C, b, o.nodeInputs.val, o.elementInputs.val, ee.length ? ee : void 0);
        try {
          o.analyzeOutputs.val = Ne(C, b, o.elementInputs.val, o.deformOutputs.val);
        } catch (e) {
          console.warn("[CLI Modeler] analyze:", (e == null ? void 0 : e.message) ?? e);
        }
        if (K.length > 0) try {
          const e = o.deformOutputs.val.deformations, d = /* @__PURE__ */ new Map(), f = /* @__PURE__ */ new Map();
          for (const a of K) {
            const w = b[a], M = w.map((L) => C[L]), u = w.flatMap((L) => {
              const y = e.get(L) ?? [
                0,
                0,
                0
              ];
              return [
                y[0],
                y[1],
                y[2]
              ];
            }), p = qe(M, t.get(a) ?? 25e6, T.get(a) ?? 0.2, u, c.solidIncompatible);
            d.set(a, p.stress), f.set(a, p.vonMises);
          }
          o.analyzeOutputs.val = {
            ...o.analyzeOutputs.val ?? {},
            solidStress: d,
            solidVonMises: f
          };
        } catch (e) {
          console.warn("[CLI Modeler] tensiones de solidos:", (e == null ? void 0 : e.message) ?? e);
        }
        console.log("[CLI Modeler] Solve OK \u2014", b.length, "elementos,", C.length, "nodos");
      } catch (e) {
        c.errors.push(`solve fall\xF3: ${e.message}`);
      }
      if (o.objects3D.val = [], c.errors.length) {
        console.warn("[CLI Modeler] Errores:");
        for (const e of c.errors) console.warn("  -", e);
      }
      window.__hekatanCliErrors = c.errors;
      let ce = 0, ge = 0;
      const ie = o.deformOutputs.val;
      if ((_a = ie == null ? void 0 : ie.deformations) == null ? void 0 : _a.size) for (const [, e] of ie.deformations) Math.abs(e[2]) > Math.abs(ce) && (ce = e[2]);
      if ((_b = ie == null ? void 0 : ie.reactions) == null ? void 0 : _b.size) for (const [, e] of ie.reactions) ge += e[2] || 0;
      window.__hekatanCliStats = {
        nodes: C.length,
        frames: c.frames.length,
        shells: c.shells.length,
        supports: V.size,
        loads: _.size,
        springs: ee.length,
        solved: c.doSolve,
        errors: c.errors.length,
        maxUzMm: +(ce * 1e3).toFixed(3),
        sumRz: +ge.toFixed(1)
      };
    }
  };
});
export {
  __tla,
  Qe as c,
  _e as p
};
