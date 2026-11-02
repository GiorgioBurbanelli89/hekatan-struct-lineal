/**
 * dump_ej6_hekatan.mts — corre el FEM de Hekatan para Ej.6 (zapata+viga amarre)
 * con los params del libro y VUELCA a JSON: nodos (x,y,z), elementos (shells Q4,
 * viga, rigid-links), springs Winkler nodales, cargas de columna, y el resultado
 * Uz por nodo + sigma=ks*|w| (la MISMA recovery de Hekatan). Esto es la verdad
 * nodo-a-nodo que SAFE debe replicar 1-a-1.
 *
 * Replica build() de zapataVigaAmarre.ts con overrides Ej.6 (guerraEj6.ts).
 * Uso:  npx tsx dump_ej6_hekatan.mts
 */
import { writeFileSync } from "fs";
import { deform, type Node } from "hekatan-fem";

const Ec = 25e6, nu_c = 0.2, Gc = Ec / (2 * (1 + nu_c)), rho = 24;
const TONF_TO_KN = 9.80665;
const KN_TO_TONF = 1 / TONF_TO_KN;

// ── Params Ej.6 (defaults zapataVigaAmarre + overrides guerraEj6.ts) ──
// NOTA: guerraEj6.ts (TS vivo) usa M2y=0. El f2k en disco tiene -35 (viejo).
// Tomamos la fuente viva: M=0 en ambas columnas.
const p = {
  Lz1: 2.38, Bz1: 3.0, Lv: 1.64, Bv: 0.45, Hv: 0.95,
  Lz2: 2.45, Bz2: 2.45, tz: 0.55, bc: 0.5, Hp: 0.5,
  ks: 37461,
  P1: 70, P1_L: 40, M1x: 0, M1y: 0, M1x_L: 0, M1y_L: 0,
  P2: 89, P2_L: 51, M2x: 0, M2y: 0, M2x_L: 0, M2y_L: 0,
  useDead: 1, useLive: 1, nSubX: 4, nSubY: 4,
};

const { Lz1, Bz1, Lv, Bv, Hv, Lz2, Bz2, tz, bc, Hp, ks } = p;
const fD = 1, fL = 1;
const P1 = (fD * p.P1 + fL * p.P1_L) * TONF_TO_KN;
const P2 = (fD * p.P2 + fL * p.P2_L) * TONF_TO_KN;
const M1x = (fD * p.M1x + fL * p.M1x_L) * TONF_TO_KN;
const M1y = (fD * p.M1y + fL * p.M1y_L) * TONF_TO_KN;
const M2x = (fD * p.M2x + fL * p.M2x_L) * TONF_TO_KN;
const M2y = (fD * p.M2y + fL * p.M2y_L) * TONF_TO_KN;
const nSubX = p.nSubX, nSubY = p.nSubY;

const yOff2 = (Bz1 - Bz2) / 2;
const xC1 = bc / 2, yC1 = Bz1 / 2;
const xC2 = Lz1 + Lv + Lz2 / 2, yC2 = Bz2 / 2 + yOff2;
const yViga = yC1;

function buildGridX(xMin: number, xMax: number, forced: number[], nSub: number): number[] {
  const all = [xMin, ...forced.filter((x) => x > xMin && x < xMax), xMax].sort((a, b) => a - b);
  const out: number[] = [];
  for (let i = 0; i < all.length - 1; i++) {
    const a = all[i], b = all[i + 1];
    const segNSub = Math.max(1, Math.round((b - a) / ((xMax - xMin) / nSub)));
    for (let k = 0; k < segNSub; k++) out.push(a + ((b - a) * k) / segNSub);
  }
  out.push(all[all.length - 1]);
  return out;
}
const xs1 = buildGridX(0, Lz1, [xC1], nSubX);
const ys1 = buildGridX(0, Bz1, [yC1, yViga], nSubY);
const xs2 = buildGridX(Lz1 + Lv, Lz1 + Lv + Lz2, [xC2], nSubX);
const ys2 = buildGridX(yOff2, yOff2 + Bz2, [yC2, yViga], nSubY);

const N: [number, number, number][] = [];
const elsEl: number[][] = [];
const elemKind: string[] = [];   // 'shell' | 'viga' | 'rigid'
const loads = new Map<number, [number, number, number, number, number, number]>();
const supports = new Map<number, [boolean, boolean, boolean, boolean, boolean, boolean]>();
const elasticities = new Map<number, number>();
const poissons = new Map<number, number>();
const areas = new Map<number, number>();
const thicknesses = new Map<number, number>();
const Iz = new Map<number, number>();
const Iy = new Map<number, number>();
const J = new Map<number, number>();
const Gm = new Map<number, number>();
const densities = new Map<number, number>();
const sections = new Map<number, any>();

const nodeMap = new Map<string, number>();
const addNode = (x: number, y: number, z: number): number => {
  const k = `${x.toFixed(4)},${y.toFixed(4)},${z.toFixed(4)}`;
  if (nodeMap.has(k)) return nodeMap.get(k)!;
  const idx = N.length; N.push([x, y, z]); nodeMap.set(k, idx); return idx;
};

const idx1: number[][] = [];
for (let j = 0; j < ys1.length; j++) {
  const row: number[] = [];
  for (let i = 0; i < xs1.length; i++) row.push(addNode(xs1[i], ys1[j], 0));
  idx1.push(row);
}
for (let j = 0; j < ys1.length - 1; j++)
  for (let i = 0; i < xs1.length - 1; i++) {
    const e = elsEl.length;
    elsEl.push([idx1[j][i], idx1[j][i + 1], idx1[j + 1][i + 1], idx1[j + 1][i]]);
    elemKind[e] = 'shell';
    thicknesses.set(e, tz); elasticities.set(e, Ec); poissons.set(e, nu_c); densities.set(e, rho);
  }
const idx2: number[][] = [];
for (let j = 0; j < ys2.length; j++) {
  const row: number[] = [];
  for (let i = 0; i < xs2.length; i++) row.push(addNode(xs2[i], ys2[j], 0));
  idx2.push(row);
}
for (let j = 0; j < ys2.length - 1; j++)
  for (let i = 0; i < xs2.length - 1; i++) {
    const e = elsEl.length;
    elsEl.push([idx2[j][i], idx2[j][i + 1], idx2[j + 1][i + 1], idx2[j + 1][i]]);
    elemKind[e] = 'shell';
    thicknesses.set(e, tz); elasticities.set(e, Ec); poissons.set(e, nu_c); densities.set(e, rho);
  }

const nCol1Bot = addNode(xC1, yC1, 0);
const nCol2Bot = addNode(xC2, yC2, 0);
const vigaPathNodes: number[] = [];
for (const x of xs1) vigaPathNodes.push(addNode(x, yC1, 0));
for (const x of xs2) vigaPathNodes.push(addNode(x, yC2, 0));
const vigaSegs: [number, number][] = [];
for (let i = 0; i < vigaPathNodes.length - 1; i++) {
  const a = vigaPathNodes[i], b = vigaPathNodes[i + 1];
  if (a === b) continue;
  const eViga = elsEl.length;
  elsEl.push([a, b]); elemKind[eViga] = 'viga';
  elasticities.set(eViga, Ec); poissons.set(eViga, nu_c); Gm.set(eViga, Gc);
  areas.set(eViga, Bv * Hv); Iz.set(eViga, (Bv * Hv ** 3) / 12); Iy.set(eViga, (Hv * Bv ** 3) / 12);
  J.set(eViga, 0.28 * Bv * Hv ** 3); densities.set(eViga, rho);
  sections.set(eViga, { type: "rect", b: Bv, h: Hv });
  vigaSegs.push([a, b]);
}

const STIFF_SIZE = 0.5;
const E_RIG = Ec * 1000, G_RIG = Gc * 1000, A_RIG = bc * bc * 100;
const I_RIG = (bc ** 4 / 12) * 100, J_RIG = 0.14 * bc ** 4 * 100;
const rigidLinks: [number, number][] = [];
function addRigidLinks(masterNode: number, mx: number, my: number, xs: number[], ys: number[], idx: number[][]): number {
  let added = 0;
  for (let j = 0; j < ys.length; j++) for (let i = 0; i < xs.length; i++) {
    const x = xs[i], y = ys[j];
    if (Math.abs(x - mx) > STIFF_SIZE / 2 + 1e-6) continue;
    if (Math.abs(y - my) > STIFF_SIZE / 2 + 1e-6) continue;
    const slave = idx[j][i]; if (slave === masterNode) continue;
    const e = elsEl.length; elsEl.push([masterNode, slave]); elemKind[e] = 'rigid';
    elasticities.set(e, E_RIG); poissons.set(e, nu_c); Gm.set(e, G_RIG);
    areas.set(e, A_RIG); Iz.set(e, I_RIG); Iy.set(e, I_RIG); J.set(e, J_RIG); densities.set(e, 0);
    sections.set(e, { type: "rect", b: bc, h: bc });
    rigidLinks.push([masterNode, slave]); added++;
  }
  return added;
}
addRigidLinks(nCol1Bot, xC1, yC1, xs1, ys1, idx1);
addRigidLinks(nCol2Bot, xC2, yC2, xs2, ys2, idx2);

loads.set(nCol1Bot, [0, 0, -P1, M1x, M1y, 0]);
loads.set(nCol2Bot, [0, 0, -P2, M2x, M2y, 0]);

// Springs Winkler (igual que build): kh dof0,1 = ks*A*0.5; kv dof2 = ks*A
const dxAvg1 = Lz1 / nSubX, dyAvg1 = Bz1 / nSubY;
const dxAvg2 = Lz2 / nSubX, dyAvg2 = Bz2 / nSubY;
const kh_factor = 0.5;
const springsList: Array<{ node: number; dof: number; k: number }> = [];
const zapataSpringNodes: number[] = [];
const springsByNode = new Map<number, { kh: number; kv: number }>();
for (let j = 0; j < ys1.length; j++) for (let i = 0; i < xs1.length; i++) {
  const A_trib = dxAvg1 * dyAvg1 * ((i === 0 || i === xs1.length - 1) ? 0.5 : 1) * ((j === 0 || j === ys1.length - 1) ? 0.5 : 1);
  const kvz = ks * A_trib, khxy = ks * A_trib * kh_factor;
  springsList.push({ node: idx1[j][i], dof: 0, k: khxy });
  springsList.push({ node: idx1[j][i], dof: 1, k: khxy });
  springsList.push({ node: idx1[j][i], dof: 2, k: kvz });
  zapataSpringNodes.push(idx1[j][i]); springsByNode.set(idx1[j][i], { kh: khxy, kv: kvz });
}
for (let j = 0; j < ys2.length; j++) for (let i = 0; i < xs2.length; i++) {
  const A_trib = dxAvg2 * dyAvg2 * ((i === 0 || i === xs2.length - 1) ? 0.5 : 1) * ((j === 0 || j === ys2.length - 1) ? 0.5 : 1);
  const kvz = ks * A_trib, khxy = ks * A_trib * kh_factor;
  springsList.push({ node: idx2[j][i], dof: 0, k: khxy });
  springsList.push({ node: idx2[j][i], dof: 1, k: khxy });
  springsList.push({ node: idx2[j][i], dof: 2, k: kvz });
  zapataSpringNodes.push(idx2[j][i]); springsByNode.set(idx2[j][i], { kh: khxy, kv: kvz });
}
const kRot = ks * dxAvg1 * dyAvg1 * 1e-4;
springsList.push({ node: idx1[0][0], dof: 3, k: kRot });
springsList.push({ node: idx1[0][0], dof: 4, k: kRot });
springsList.push({ node: idx1[0][0], dof: 5, k: kRot });

// ── Run Hekatan deform ──
const nodes = N.map((n) => [n[0], n[1], n[2]] as Node);
const nodeInputs = { supports, loads };
const elementInputs = {
  elasticities, poissonsRatios: poissons, areas,
  momentsOfInertiaZ: Iz, momentsOfInertiaY: Iy, torsionalConstants: J,
  shearModuli: Gm, thicknesses, densities, sectionShapes: sections,
};
const dout = deform(nodes, elements_clone(), nodeInputs, elementInputs, springsList);
function elements_clone() { return elsEl; }

const deformsMap = (dout as any).deformations as Map<number, number[]>;

// sigma = ks * w por nodo (kN/m2), -> tonf
const perNode: any[] = [];
let z1max = -Infinity, z1min = Infinity, z2max = -Infinity, z2min = Infinity;
for (const n of zapataSpringNodes) {
  const d = deformsMap.get(n);
  const w = d ? d[2] : 0;
  const ux = d ? d[0] : 0, uy = d ? d[1] : 0;
  const sigma_kN = ks * w;                 // compresion negativa
  const sigma_t = sigma_kN * KN_TO_TONF;
  const [x, y] = N[n];
  const zap = x < 3.5 ? 'Z1' : 'Z2';
  const sabs = Math.abs(sigma_t);
  if (zap === 'Z1') { z1max = Math.max(z1max, sabs); z1min = Math.min(z1min, sabs); }
  else { z2max = Math.max(z2max, sabs); z2min = Math.min(z2min, sabs); }
  perNode.push({ node: n, x: round(x), y: round(y), zap,
    uz: w, ux, uy, sigma_t: round(sabs, 4) });
}

function round(v: number, d = 6) { const f = 10 ** d; return Math.round(v * f) / f; }

const dump = {
  meta: { ks_kNm3: ks, ks_tonf: round(ks * KN_TO_TONF, 2), tz, bc, Bv, Hv,
    P1_tonf: p.P1 + p.P1_L, P2_tonf: p.P2 + p.P2_L, M2y_tonf: p.M2y,
    nNodes: N.length, nShellSpringNodes: zapataSpringNodes.length },
  cols: { col1: { node: nCol1Bot, x: round(xC1), y: round(yC1), P_kN: P1, Mx_kN: M1x, My_kN: M1y },
          col2: { node: nCol2Bot, x: round(xC2), y: round(yC2), P_kN: P2, Mx_kN: M2x, My_kN: M2y } },
  nodes: N.map((n, i) => ({ i, x: round(n[0]), y: round(n[1]), z: round(n[2]) })),
  shellElems: elsEl.map((e, i) => ({ i, kind: elemKind[i], n: e })).filter(e => e.kind === 'shell'),
  vigaSegs, rigidLinks,
  springs: Array.from(springsByNode.entries()).map(([node, s]) => ({ node, kh: round(s.kh, 4), kv: round(s.kv, 4) })),
  zapataSpringNodes,
  hekatan_result: {
    Z1: { sigma_max: round(z1max, 4), sigma_min: round(z1min, 4) },
    Z2: { sigma_max: round(z2max, 4), sigma_min: round(z2min, 4) },
    perNode,
  },
};

const out = (process.env.USERPROFILE ?? "") + "\\Documents\\Hekatan Calc 1.0.0\\validacion\\safe-api\\ej6_hekatan_truth.json";
writeFileSync(out, JSON.stringify(dump, null, 1), "utf8");
console.log("Hekatan Ej.6 dump ->", out);
console.log("  nodos totales:", N.length, " nodos-con-spring:", zapataSpringNodes.length);
console.log("  shells:", dump.shellElems.length, " viga segs:", vigaSegs.length, " rigid links:", rigidLinks.length);
console.log("  Z1 sigma_max=", round(z1max, 3), " sigma_min=", round(z1min, 3), "t/m2");
console.log("  Z2 sigma_max=", round(z2max, 3), " sigma_min=", round(z2min, 3), "t/m2");
