// Estudio de la torsión de las vigas: Centroid (10) frente a Top Center + casilla desmarcada (8) en 10 modelos de losa-vigas-columnas.
// Hekatan Struct (kN·m). Uso (desde hekatan-struct):  node validation/insercion/struct_estudio.mjs <id|all> [cp] [JF]
// Cada modelo cambia UN factor respecto al modelo base A. Losa Shell-Thin (DKQ), malla de 1 m, carga q = 5 kN/m² sobre toda la losa.
import { writeFileSync } from "node:fs";
import { cargarFem } from "../../tests/lib/bundle.mjs";

const BASE = { nx: 1, ny: 1, Lp: 4, t: 0.145, bb: 0.20, bh: 0.40, col: 0.25, H: 3, v: 0, cargaBorde: 0 };
export const MODELOS = {
  A: { ...BASE, nombre: "A  base: 1 panel 4×4, viga 0.20×0.40, columna 0.25, t 0.145" },
  B: { ...BASE, t: 0.30, nombre: "B  losa más gruesa (t = 0.30)" },
  C: { ...BASE, bb: 0.30, nombre: "C  viga más ancha (0.30×0.40)" },
  D: { ...BASE, bh: 0.60, nombre: "D  viga más alta (0.20×0.60)" },
  E: { ...BASE, col: 0.40, nombre: "E  columnas más rígidas (0.40)" },
  F: { ...BASE, H: 6, nombre: "F  columnas más flexibles (H = 6 m)" },
  G: { ...BASE, Lp: 8, nombre: "G  panel de 8×8 m" },
  H: { ...BASE, nx: 2, nombre: "H  2×1 paneles con viga interior" },
  I: { ...BASE, nx: 2, ny: 2, nombre: "I  2×2 paneles continuos" },
  J: { ...BASE, v: 2, anillo: true, nombre: "J  solo un anillo de losa en voladizo de 2 m (torsión de EQUILIBRIO)" },
};

export async function correr(id, cp, JF) {
  const M = MODELOS[id];
  const fem = await cargarFem();
  const E = 2.5e10, nu = 0.2, G = E / (2 * (1 + nu)), Q = 5000;
  const Lx = M.nx * M.Lp, Ly = M.ny * M.Lp;
  const N = [], idx = new Map();
  const nodo = (x, y, z) => { const k = [x, y, z].map(w => w.toFixed(4)).join(","); if (!idx.has(k)) { idx.set(k, N.length); N.push([x, y, z]); } return idx.get(k); };
  const els = [], tipo = [], info = [];
  // columnas en cada cruce de ejes
  for (let i = 0; i <= M.nx; i++) for (let j = 0; j <= M.ny; j++) { els.push([nodo(i * M.Lp, j * M.Lp, 0), nodo(i * M.Lp, j * M.Lp, M.H)]); tipo.push("col"); info.push({}); }
  // vigas en todas las líneas de ejes, tramos de 1 m
  for (let j = 0; j <= M.ny; j++) for (let x = 0; x < Lx; x++) { els.push([nodo(x, j * M.Lp, M.H), nodo(x + 1, j * M.Lp, M.H)]); tipo.push("viga"); info.push({ dir: "x", borde: j === 0 || j === M.ny }); }
  for (let i = 0; i <= M.nx; i++) for (let y = 0; y < Ly; y++) { els.push([nodo(i * M.Lp, y, M.H), nodo(i * M.Lp, y + 1, M.H)]); tipo.push("viga"); info.push({ dir: "y", borde: i === 0 || i === M.nx }); }
  // losa: toda la región, incluido el voladizo
  for (let x = -M.v; x < Lx + M.v; x++) for (let y = -M.v; y < Ly + M.v; y++) { if (M.anillo && x >= 0 && x < Lx && y >= 0 && y < Ly) continue; els.push([nodo(x, y, M.H), nodo(x + 1, y, M.H), nodo(x + 1, y + 1, M.H), nodo(x, y + 1, M.H)]); tipo.push("losa"); info.push({}); }
  const ei = { elasticities: new Map(), poissonsRatios: new Map(), shearModuli: new Map(), densities: new Map(), areas: new Map(), momentsOfInertiaY: new Map(), momentsOfInertiaZ: new Map(),
    torsionalConstants: new Map(), thicknesses: new Map(), plateFormulations: new Map(), insertionOffsets: new Map() };
  els.forEach((e, i) => {
    ei.elasticities.set(i, E); ei.poissonsRatios.set(i, nu); ei.shearModuli.set(i, G); ei.densities.set(i, 0);
    if (e.length === 2) {
      const col = tipo[i] === "col"; const [t2, t3] = col ? [M.col, M.col] : [M.bb, M.bh];
      ei.areas.set(i, t2 * t3); ei.momentsOfInertiaZ.set(i, t2 * t3 ** 3 / 12); ei.momentsOfInertiaY.set(i, t3 * t2 ** 3 / 12);
      const a = Math.max(t2, t3), b = Math.min(t2, t3);
      ei.torsionalConstants.set(i, (col ? 1 : JF) * a * b ** 3 * (1 / 3 - 0.21 * (b / a) * (1 - b ** 4 / (12 * a ** 4))));
      if (!col && cp === 8) ei.insertionOffsets.set(i, [-M.bh / 2, 0]);
    } else { ei.thicknesses.set(i, M.t); ei.plateFormulations.set(i, 1); }
  });
  const loads = new Map();
  els.forEach((e, i) => { if (e.length !== 4) return; for (const nd of e) { const q = loads.get(nd) ?? [0, 0, 0, 0, 0, 0]; q[2] -= Q / 4; loads.set(nd, q); } });
  const supports = new Map(); els.forEach((e, i) => { if (tipo[i] === "col") supports.set(e[0], [true, true, true, true, true, true]); });
  const d = fem.deform(N, els, { supports, loads }, ei);
  const a = fem.analyze(N, els, ei, d);
  const vig = els.map((e, i) => i).filter(i => tipo[i] === "viga");
  const mx = (arr) => Math.max(0, ...arr.map(Math.abs));
  const Tb = mx(vig.filter(i => info[i].borde).flatMap(i => a.torsions.get(i))) / 1000;
  const Ti = vig.some(i => !info[i].borde) ? mx(vig.filter(i => !info[i].borde).flatMap(i => a.torsions.get(i))) / 1000 : null;
  const P = mx(vig.flatMap(i => a.normals.get(i))) / 1000, Mm = mx(vig.flatMap(i => a.bendingsZ.get(i))) / 1000;
  // giro de la columna en su cabeza (la torsión de la viga se descarga ahí)
  const cols = els.map((e, i) => i).filter(i => tipo[i] === "col");
  const gc = Math.max(...cols.map(i => Math.hypot(d.deformations.get(els[i][1])[3], d.deformations.get(els[i][1])[4])));
  // giro de la viga de borde (eje x, y = 0): a mitad de luz, en la columna, y lo que se TUERCE entre las dos
  const nid = (x, y) => N.findIndex(q => Math.abs(q[0] - x) < 1e-6 && Math.abs(q[1] - y) < 1e-6 && Math.abs(q[2] - M.H) < 1e-6);
  const rMid = Math.abs(d.deformations.get(nid(M.Lp / 2, 0))[3]), rCol = Math.abs(d.deformations.get(nid(0, 0))[3]);
  const torcido = Math.abs(d.deformations.get(nid(M.Lp / 2, 0))[3] - d.deformations.get(nid(0, 0))[3]);
  const uz = Math.min(...[...d.deformations.values()].map(u => u[2])) * 1000;
  return { id, cp, JF, Tborde: +Tb.toFixed(4), Tinterior: Ti === null ? null : +Ti.toFixed(4), N: +P.toFixed(3), M: +Mm.toFixed(3), giroCol: gc, rMid, rCol, torcido, uzMin: +uz.toFixed(4) };
}

if (process.argv[1] && process.argv[1].endsWith("struct_estudio.mjs")) {
  const ids = process.argv[2] === "all" || !process.argv[2] ? Object.keys(MODELOS) : [process.argv[2]];
  const JFs = process.argv[3] ? [+process.argv[3]] : [1, 0.1];
  const out = [];
  for (const id of ids) for (const JF of JFs) for (const cp of [10, 8]) out.push(await correr(id, cp, JF));
  writeFileSync("validation/insercion/estudio_struct.json", JSON.stringify(out, null, 1));
  console.log("id  J×   T borde (centroide → Top)   ΔT%     T interior   N(Top)   giro col. (rad)");
  for (const id of ids) for (const JF of JFs) {
    const a = out.find(r => r.id === id && r.JF === JF && r.cp === 10), b = out.find(r => r.id === id && r.JF === JF && r.cp === 8);
    console.log(`${id}   ${String(JF).padEnd(4)} ${a.Tborde.toFixed(3).padStart(8)} → ${b.Tborde.toFixed(3).padStart(7)}      ${(100 * (b.Tborde / a.Tborde - 1)).toFixed(1).padStart(6)}    ${a.Tinterior === null ? "   —   " : a.Tinterior.toFixed(3) + "→" + b.Tinterior.toFixed(3)}   ${b.N.toFixed(1).padStart(7)}   ${a.giroCol.toExponential(2)} → ${b.giroCol.toExponential(2)}`);
  }
}
