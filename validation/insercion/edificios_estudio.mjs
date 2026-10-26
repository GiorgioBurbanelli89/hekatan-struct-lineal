// Estudio del Tu (torsión de diseño, envolvente de combinaciones ACI con sismo) de las vigas de 20 edificios, regulares e irregulares.
// Centroid (10) frente a Top Center + casilla desmarcada (8). La situación «Top Center + casilla marcada» es idéntica a Centroid (medido).
// kN, m. Losa Shell-Thin (DKQ), malla de 1 m, sin agrietar (J completa), sin diafragma rígido (la losa lleva el plano).
// Uso (desde hekatan-struct): node validation/insercion/edificios_estudio.mjs <id|all>
import { writeFileSync, mkdirSync } from "node:fs";
import { cargarFem } from "../../tests/lib/bundle.mjs";

const REG = { bx: [5, 5, 5], by: [5, 5, 5], h: [3, 3, 3], bb: 0.30, bh: 0.50, col: 0.40, t: 0.15 };
// `quita(s, ix, iy)`: la crujía (ix, iy) NO existe en el piso s (1-based) · `hueco(s, ix, iy)`: existe con vigas pero sin losa
// `sinCol(s, i, j)`: falta la columna del piso s en el cruce de ejes (i, j) · `extraD(s, ix, iy)`: carga muerta adicional (kN/m²)
// `colDe(s, i, j)`: lado de la columna en ese cruce (por defecto spec.col)
export const EDIFICIOS = {
  R1: { ...REG, bx: [5, 5], by: [5, 5], nombre: "R1  regular 2×2 crujías de 5 m, 3 pisos" },
  R2: { ...REG, nombre: "R2  regular 3×3 crujías de 5 m, 3 pisos" },
  R3: { ...REG, h: [3, 3, 3, 3, 3, 3], nombre: "R3  regular 3×3, 6 pisos" },
  R4: { ...REG, bx: [7, 7], by: [7, 7], nombre: "R4  regular 2×2 crujías de 7 m (luces grandes)" },
  R5: { ...REG, bx: [5, 5, 5, 5], by: [5, 5], nombre: "R5  regular rectangular 4×2 crujías" },
  R6: { ...REG, bx: [4, 4, 4], by: [4, 4, 4], bh: 0.60, nombre: "R6  regular 3×3 de 4 m, vigas 0.30×0.60" },
  R7: { ...REG, t: 0.20, nombre: "R7  regular, losa gruesa t = 0.20" },
  R8: { ...REG, col: 0.60, nombre: "R8  regular, columnas 0.60" },
  R9: { ...REG, bb: 0.25, bh: 0.40, nombre: "R9  regular, vigas esbeltas 0.25×0.40" },
  R10: { ...REG, h: [3.6, 3.6, 3.6, 3.6], nombre: "R10 regular, 4 pisos de 3.6 m" },
  I1: { ...REG, bx: [4, 4, 4, 4], by: [4, 4, 4, 4], quita: (s, ix, iy) => ix >= 2 && iy >= 2, nombre: "I1  en L (planta 4×4 sin una esquina de 2×2)" },
  I2: { ...REG, bx: [4, 4, 4], by: [4, 4, 4], quita: (s, ix, iy) => ix === 1 && iy >= 1, nombre: "I2  en U (falta la crujía central de un lado)" },
  I3: { ...REG, bx: [4, 4, 4], by: [4, 4, 4], quita: (s, ix, iy) => iy >= 1 && ix !== 1, nombre: "I3  en T" },
  I4: { ...REG, hueco: (s, ix, iy) => ix === 1 && iy === 1, nombre: "I4  con hueco de losa central" },
  I5: { ...REG, quita: (s, ix, iy) => s >= 2 && (ix !== 1 || iy !== 1) && s >= 2 && !(ix >= 0 && ix <= 1 && iy >= 0 && iy <= 1), nombre: "I5  con retranqueo (pisos altos más pequeños)" },
  I6: { ...REG, h: [5, 3, 3], nombre: "I6  piso blando (primer piso de 5 m)" },
  I7: { ...REG, sinCol: (s, i, j) => s === 1 && i === 1 && j === 1, nombre: "I7  columna interior faltante en el primer piso" },
  I8: { ...REG, bx: [3, 6, 3], by: [4, 4, 4], nombre: "I8  crujías desiguales 3-6-3" },
  I9: { ...REG, extraD: (s, ix, iy) => (s === 2 && ix === 2 && iy === 2 ? 8 : 0), nombre: "I9  masa irregular (carga muerta extra en una crujía)" },
  I10: { ...REG, colDe: (s, i, j) => (i <= 1 ? 0.60 : 0.30), nombre: "I10 torsional: columnas rígidas a un lado, flexibles al otro" },
};

const E = 2.5e7, nu = 0.2, G = E / (2 * (1 + nu)), QD = 6, QL = 2, CS = 0.12;
const fc = 28;                                              // MPa (E = 25 GPa ≈ 4700·√f'c)
const Jrect = (a, b) => { const A = Math.max(a, b), B = Math.min(a, b); return A * B ** 3 * (1 / 3 - 0.21 * (B / A) * (1 - B ** 4 / (12 * A ** 4))); };

export function construir(S) {
  const nbx = S.bx.length, nby = S.by.length, ns = S.h.length;
  const xs = [0], ys = [0]; S.bx.forEach(b => xs.push(xs.at(-1) + b)); S.by.forEach(b => ys.push(ys.at(-1) + b));
  const zs = [0]; S.h.forEach(h => zs.push(zs.at(-1) + h));
  const existe = (s, ix, iy) => ix >= 0 && iy >= 0 && ix < nbx && iy < nby && !(S.quita && S.quita(s, ix, iy));
  const N = [], idx = new Map();
  const nodo = (x, y, z) => { const k = [x, y, z].map(w => w.toFixed(3)).join(","); if (!idx.has(k)) { idx.set(k, N.length); N.push([x, y, z]); } return idx.get(k); };
  const els = [], tipo = [], info = [], vistos = new Set();
  const viga = (s, a, b) => { const k = a < b ? a + "-" + b : b + "-" + a; if (vistos.has(k)) return; vistos.add(k); els.push([a, b]); tipo.push("viga"); info.push({ piso: s }); };
  const nCelda = [];                                         // celdas de losa por piso: [n0..n3, x, y]
  for (let s = 1; s <= ns; s++) {
    const z = zs[s];
    for (let ix = 0; ix < nbx; ix++) for (let iy = 0; iy < nby; iy++) {
      if (!existe(s, ix, iy)) continue;
      const x0 = xs[ix], x1 = xs[ix + 1], y0 = ys[iy], y1 = ys[iy + 1];
      for (let x = x0; x < x1; x++) { viga(s, nodo(x, y0, z), nodo(x + 1, y0, z)); viga(s, nodo(x, y1, z), nodo(x + 1, y1, z)); }
      for (let y = y0; y < y1; y++) { viga(s, nodo(x0, y, z), nodo(x0, y + 1, z)); viga(s, nodo(x1, y, z), nodo(x1, y + 1, z)); }
      if (S.hueco && S.hueco(s, ix, iy)) continue;
      for (let x = x0; x < x1; x++) for (let y = y0; y < y1; y++) {
        els.push([nodo(x, y, z), nodo(x + 1, y, z), nodo(x + 1, y + 1, z), nodo(x, y + 1, z)]); tipo.push("losa");
        info.push({ piso: s, extra: S.extraD ? S.extraD(s, ix, iy) : 0 });
      }
    }
    // columnas del piso s: en cada cruce de ejes tocado por una crujía existente del piso s
    for (let i = 0; i <= nbx; i++) for (let j = 0; j <= nby; j++) {
      const toca = existe(s, i - 1, j - 1) || existe(s, i, j - 1) || existe(s, i - 1, j) || existe(s, i, j);
      if (!toca || (S.sinCol && S.sinCol(s, i, j))) continue;
      els.push([nodo(xs[i], ys[j], zs[s - 1]), nodo(xs[i], ys[j], z)]); tipo.push("col"); info.push({ piso: s, lado: S.colDe ? S.colDe(s, i, j) : S.col });
    }
  }
  // cargas nodales: D, L (verticales) y sismo estático equivalente en X e Y, repartido por área tributaria de la losa de cada piso
  const D = new Map(), L = new Map(), EX = new Map(), EY = new Map();
  const add = (m, n, v) => { const q = m.get(n) ?? [0, 0, 0, 0, 0, 0]; for (let k = 0; k < 6; k++) q[k] += v[k]; m.set(n, q); };
  const area = new Array(ns + 1).fill(0), peso = new Array(ns + 1).fill(0);
  els.forEach((e, i) => { if (tipo[i] === "losa") { area[info[i].piso] += 1; peso[info[i].piso] += (QD + QL * 0.25 + info[i].extra); } });
  let sumWh = 0, sumW = 0; for (let s = 1; s <= ns; s++) { sumWh += peso[s] * zs[s]; sumW += peso[s]; }
  const V = CS * sumW;
  els.forEach((e, i) => {
    if (tipo[i] !== "losa") return;
    const s = info[i].piso, Fs = V * peso[s] * zs[s] / sumWh;
    for (const n of e) {
      add(D, n, [0, 0, -(QD + info[i].extra) / 4, 0, 0, 0]); add(L, n, [0, 0, -QL / 4, 0, 0, 0]);
      add(EX, n, [Fs / area[s] / 4, 0, 0, 0, 0, 0]); add(EY, n, [0, Fs / area[s] / 4, 0, 0, 0, 0]);
    }
  });
  const supports = new Map(); els.forEach((e, i) => { if (tipo[i] === "col" && N[e[0]][2] === 0) supports.set(e[0], [true, true, true, true, true, true]); });
  return { N, els, tipo, info, cargas: { D, L, EX, EY }, supports, V, ns };
}

const COMBOS = (() => { const c = [{ n: "1.4D", D: 1.4, L: 0, EX: 0, EY: 0 }, { n: "1.2D+1.6L", D: 1.2, L: 1.6, EX: 0, EY: 0 }];
  for (const [e, nm] of [["EX", "X"], ["EY", "Y"]]) for (const sg of [1, -1]) {
    c.push({ n: `1.2D+L${sg > 0 ? "+" : "-"}E${nm}`, D: 1.2, L: 1, EX: 0, EY: 0, [e]: sg });
    c.push({ n: `0.9D${sg > 0 ? "+" : "-"}E${nm}`, D: 0.9, L: 0, EX: 0, EY: 0, [e]: sg }); }
  return c; })();

export async function correr(id, cp) {
  const S = EDIFICIOS[id], fem = await cargarFem();
  const B = construir(S);
  const ei = { elasticities: new Map(), poissonsRatios: new Map(), shearModuli: new Map(), densities: new Map(), areas: new Map(), momentsOfInertiaY: new Map(),
    momentsOfInertiaZ: new Map(), torsionalConstants: new Map(), thicknesses: new Map(), plateFormulations: new Map(), insertionOffsets: new Map() };
  B.els.forEach((e, i) => {
    ei.elasticities.set(i, E); ei.poissonsRatios.set(i, nu); ei.shearModuli.set(i, G); ei.densities.set(i, 0);
    if (B.tipo[i] === "losa") { ei.thicknesses.set(i, S.t); ei.plateFormulations.set(i, 1); return; }
    const col = B.tipo[i] === "col"; const [t2, t3] = col ? [B.info[i].lado, B.info[i].lado] : [S.bb, S.bh];
    ei.areas.set(i, t2 * t3); ei.momentsOfInertiaZ.set(i, t2 * t3 ** 3 / 12); ei.momentsOfInertiaY.set(i, t3 * t2 ** 3 / 12); ei.torsionalConstants.set(i, Jrect(t2, t3));
    if (!col && cp === 8) ei.insertionOffsets.set(i, [-S.bh / 2, 0]);
  });
  const res = {};
  for (const lc of ["D", "L", "EX", "EY"]) {
    const d = fem.deform(B.N, B.els, { supports: B.supports, loads: B.cargas[lc] }, ei);
    const a = fem.analyze(B.N, B.els, ei, d);
    res[lc] = { T: a.torsions, Nn: a.normals, Mz: a.bendingsZ, uz: d.deformations };
  }
  const vig = B.els.map((e, i) => i).filter(i => B.tipo[i] === "viga");
  const Acp = S.bb * S.bh, pcp = 2 * (S.bb + S.bh);
  const Tth = 0.75 * 0.083 * Math.sqrt(fc) * (Acp * 1e6) ** 2 / (pcp * 1e3) / 1e6, Tcr = 0.75 * 0.33 * Math.sqrt(fc) * (Acp * 1e6) ** 2 / (pcp * 1e3) / 1e6;
  let TuG = 0, TuS = 0, Tu = 0, ctrl = "", viga0 = -1, Nu = 0, Mu = 0, nTh = 0, nCr = 0;
  const TuPorViga = new Map();
  for (const i of vig) {
    let m = 0;
    for (const c of COMBOS) {
      const t = [0, 1].map(k => c.D * res.D.T.get(i)[k] + c.L * res.L.T.get(i)[k] + c.EX * res.EX.T.get(i)[k] + c.EY * res.EY.T.get(i)[k]);
      const v = Math.max(Math.abs(t[0]), Math.abs(t[1]));
      if (v > m) m = v; if (v > Tu) { Tu = v; ctrl = c.n; viga0 = i; }
      if (c.EX === 0 && c.EY === 0) TuG = Math.max(TuG, v); else TuS = Math.max(TuS, v);
      const n = [0, 1].map(k => c.D * res.D.Nn.get(i)[k] + c.L * res.L.Nn.get(i)[k] + c.EX * res.EX.Nn.get(i)[k] + c.EY * res.EY.Nn.get(i)[k]);
      const mm = [0, 1].map(k => c.D * res.D.Mz.get(i)[k] + c.L * res.L.Mz.get(i)[k] + c.EX * res.EX.Mz.get(i)[k] + c.EY * res.EY.Mz.get(i)[k]);
      Nu = Math.max(Nu, Math.abs(n[0]), Math.abs(n[1])); Mu = Math.max(Mu, Math.abs(mm[0]), Math.abs(mm[1]));
    }
    TuPorViga.set(i, m); if (m > Tth) nTh++; if (m > Tcr) nCr++;
  }
  return { id, cp, TuGrav: +TuG.toFixed(4), TuSism: +TuS.toFixed(4), Tu: +Tu.toFixed(4), combo: ctrl, nVigas: vig.length, nSobreUmbral: nTh, nSobreTcr: nCr, Tth: +Tth.toFixed(3), Tcr: +Tcr.toFixed(3), Nu: +Nu.toFixed(2), Mu: +Mu.toFixed(2),
    nodos: B.N.length, V: +B.V.toFixed(1) };
}

if (process.argv[1] && process.argv[1].endsWith("edificios_estudio.mjs")) {
  const ids = process.argv[2] === "all" || !process.argv[2] ? Object.keys(EDIFICIOS) : [process.argv[2]];
  const out = [];
  console.log("id    Tu centroide → Top desm.   cambio    vigas>Tth (cent→top)   Tcr   Nu(top)  combinación");
  for (const id of ids) {
    const t0 = Date.now(), a = await correr(id, 10), b = await correr(id, 8);
    out.push(a, b);
    console.log(`      gravedad sola: ${a.TuGrav.toFixed(3)} → ${b.TuGrav.toFixed(3)} (${(100 * (b.TuGrav / a.TuGrav - 1)).toFixed(1)}%)   con sismo: ${a.TuSism.toFixed(3)} → ${b.TuSism.toFixed(3)} (${(100 * (b.TuSism / a.TuSism - 1)).toFixed(1)}%)`);
    console.log(`${id.padEnd(4)} ${a.Tu.toFixed(3).padStart(8)} → ${b.Tu.toFixed(3).padStart(8)}   ${(100 * (b.Tu / a.Tu - 1)).toFixed(1).padStart(6)}%    ${String(a.nSobreUmbral).padStart(3)} → ${String(b.nSobreUmbral).padStart(3)} de ${a.nVigas}      ${a.Tcr}  ${b.Nu.toFixed(1).padStart(7)}   ${a.combo} / ${b.combo}   (${((Date.now() - t0) / 1000).toFixed(0)} s, ${a.nodos} nudos)`);
    writeFileSync("validation/insercion/edificios_struct.json", JSON.stringify(out, null, 1));
  }
}
