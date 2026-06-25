/**
 * gen_drilling_e2k.ts — genera el .e2k del modelo drilling-dof (2 muros + viga de acople)
 * usando el EXPORTADOR REAL del DOM (examples/src/shared/e2kExporter.ts).
 *
 * Reconstruye la MISMA geometría que examples/src/test/drillingDof.ts (sin correr el solver,
 * el exportador no lo necesita) y escribe el .e2k a disco. Bundlear con esbuild y correr con node:
 *   node_modules/.bin/esbuild examples/src/test/gen_drilling_e2k.ts --bundle --platform=node --format=esm --outfile=/tmp/gen.mjs
 *   node /tmp/gen.mjs <salida.e2k>
 */
import { writeFileSync } from "node:fs";
import { exportE2k } from "../shared/e2kExporter";

// ── parámetros (defaults del ejemplo) ──
const W = 2.0, H = 4.0, gap = 1.5, t = 0.25, bH = 0.8;
const E = 24850e3, nu = 0.20, F = 100;
const nx = 4, nz = 8, nb = 3;

const dxL = W / nx, dz = H / nz, x0R = W + gap;

const nodes: number[][] = [];
const idx = new Map<string, number>();
const add = (x: number, z: number) => {
  const key = `${x.toFixed(4)},${z.toFixed(4)}`;
  let id = idx.get(key);
  if (id === undefined) { id = nodes.length; nodes.push([x, 0, z]); idx.set(key, id); }
  return id;
};

const elements: number[][] = [];
function pier(x0: number) {
  const grid: number[][] = [];
  for (let k = 0; k <= nz; k++) {
    const row: number[] = [];
    for (let i = 0; i <= nx; i++) row.push(add(x0 + i * dxL, k * dz));
    grid.push(row);
  }
  for (let k = 0; k < nz; k++)
    for (let i = 0; i < nx; i++)
      elements.push([grid[k][i], grid[k][i + 1], grid[k + 1][i + 1], grid[k + 1][i]]);
  return grid;
}
const gL = pier(0), gR = pier(x0R);

const nL = gL[nz][nx], nR = gR[nz][0];
const beamElemStart = elements.length;
const chain = [nL];
for (let i = 1; i < nb; i++) chain.push(add(W + gap * i / nb, H));
chain.push(nR);
for (let i = 0; i < nb; i++) elements.push([chain[i], chain[i + 1]]);

type B6 = [boolean, boolean, boolean, boolean, boolean, boolean];
const supports = new Map<number, B6>();
for (let i = 0; i <= nx; i++) {
  supports.set(gL[0][i], [true, true, true, true, true, true]);
  supports.set(gR[0][i], [true, true, true, true, true, true]);
}
type N6 = [number, number, number, number, number, number];
const loads = new Map<number, N6>();
const Fx = F / (nx + 1);
for (const g of [gL, gR])
  for (let i = 0; i <= nx; i++) {
    const id = g[nz][i];
    const cur = (loads.get(id) || [0, 0, 0, 0, 0, 0]) as N6;
    cur[0] += Fx; loads.set(id, cur);
  }

const thicknesses = new Map<number, number>();
const elasticities = new Map<number, number>();
const poissons = new Map<number, number>();
const densities = new Map<number, number>();
const areas = new Map<number, number>();
const momentsOfInertiaY = new Map<number, number>();
const momentsOfInertiaZ = new Map<number, number>();
const torsionalConstants = new Map<number, number>();
const shearModuli = new Map<number, number>();
const orientations = new Map<number, [number, number, number]>();
const sectionShapes = new Map<number, any>();

for (let e = 0; e < beamElemStart; e++) {
  thicknesses.set(e, t); elasticities.set(e, E); poissons.set(e, nu); densities.set(e, 24);
}
const b = t, h = bH, G = E / (2 * (1 + nu));
for (let e = beamElemStart; e < elements.length; e++) {
  areas.set(e, b * h);
  momentsOfInertiaY.set(e, b * h ** 3 / 12);
  momentsOfInertiaZ.set(e, h * b ** 3 / 12);
  torsionalConstants.set(e, b * h ** 3 / 12 + h * b ** 3 / 12);
  elasticities.set(e, E); shearModuli.set(e, G); densities.set(e, 24);
  orientations.set(e, [0, 0, 1]);
  sectionShapes.set(e, { type: "rect", b, h, name: `VA-${Math.round(b * 100)}x${Math.round(h * 100)}` });
}

const e2k = exportE2k({
  nodes: nodes as any,
  elements: elements as any,
  nodeInputs: { supports, loads } as any,
  elementInputs: {
    thicknesses, elasticities, poissonsRatios: poissons, densities,
    areas, momentsOfInertiaY, momentsOfInertiaZ, torsionalConstants,
    shearModuli, orientations, sectionShapes,
  } as any,
  title: "Drilling DOF — 2 muros + viga de acople (Hekatan Struct)",
  units: { force: "KN", length: "M" },
});

const out = process.argv[2] || "drilling_dof.e2k";
writeFileSync(out, e2k, "utf8");
console.log(`[OK] e2k generado: ${out}`);
console.log(`     ${e2k.split("\n").length} lineas, ${nodes.length} nodos, ${elements.length} elementos (${beamElemStart} shells + ${elements.length - beamElemStart} frames)`);
