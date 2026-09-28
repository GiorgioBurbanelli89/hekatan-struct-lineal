import { deform } from './hekatan-fem/src/deform.js';

// Simply supported plate with central load (activates bending = ShellThick)
// 1m x 1m plate, t=0.1m, E=2e7, nu=0.3
// Simply supported on all 4 edges, 1 tonf point load at center
// Y-up: plate in XZ plane, w = Y displacement (out of plane)

const nDiv = 4;
const nodes: [number,number,number][] = [];
for (let j = 0; j <= nDiv; j++) {
  for (let i = 0; i <= nDiv; i++) {
    nodes.push([i / nDiv, 0, j / nDiv]); // plate in XZ plane, Y = out of plane
  }
}
const elements: number[][] = [];
for (let j = 0; j < nDiv; j++) {
  for (let i = 0; i < nDiv; i++) {
    const n0 = j * (nDiv + 1) + i;
    elements.push([n0, n0 + 1, n0 + nDiv + 2, n0 + nDiv + 1]);
  }
}

// Simply supported: fix UY (w) on all edges, fix all at corners
const supports = new Map<number, [boolean,boolean,boolean,boolean,boolean,boolean]>();
for (let j = 0; j <= nDiv; j++) {
  for (let i = 0; i <= nDiv; i++) {
    const ni = j * (nDiv + 1) + i;
    if (i === 0 || i === nDiv || j === 0 || j === nDiv) {
      // Edge: fix w (UY) only
      supports.set(ni, [false, true, false, false, false, false]);
    }
  }
}
// Corners: fix all translations to prevent rigid body
supports.set(0, [true, true, true, true, true, true]);
supports.set(nDiv, [true, true, true, false, false, false]);
supports.set(nDiv * (nDiv + 1), [true, true, true, false, false, false]);
supports.set(nDiv * (nDiv + 1) + nDiv, [true, true, true, false, false, false]);

// 1 tonf at center node (out of plane = Y direction)
const centerNode = Math.floor(nDiv / 2) * (nDiv + 1) + Math.floor(nDiv / 2);
const loads = new Map<number, [number,number,number,number,number,number]>();
loads.set(centerNode, [0, -1, 0, 0, 0, 0]); // -Y = downward

const elementInputs: any = {
  elasticities: new Map(elements.map((_, i) => [i, 2e7])),
  thicknesses: new Map(elements.map((_, i) => [i, 0.1])),
  poissonsRatios: new Map(elements.map((_, i) => [i, 0.3])),
};

console.log("=== PLATE BENDING: Simply supported, central load ===");
console.log(`${nDiv}x${nDiv} mesh, 1m x 1m, t=0.1m, E=2e7, nu=0.3, P=1 tonf`);
console.log(`Center node: ${centerNode}`);

try {
  const result = deform(nodes, elements, { supports, loads }, elementInputs);
  const wy = result?.deformations?.get(centerNode)?.[1] ?? 0;
  
  // Analytical: Navier solution for SS plate with central load
  // w_max = alpha * P * a^2 / (E * t^3)
  // For a/b = 1, alpha = 0.01160 (Timoshenko Table 35)
  // D = E*t^3 / (12*(1-nu^2)) = 2e7 * 0.001 / (12*0.91) = 1831.5
  // w = 0.01160 * P * a^2 / D = 0.01160 * 1 * 1 / 1831.5 = 6.33e-6
  const D = 2e7 * 0.1**3 / (12 * (1 - 0.3**2));
  const w_analytical = 0.01160 * 1 * 1**2 / D;
  
  console.log(`\nHekatan w_center: ${wy.toExponential(6)} m`);
  console.log(`Analytical:      ${(-w_analytical).toExponential(6)} m`);
  console.log(`Error: ${(Math.abs(Math.abs(wy) - w_analytical) / w_analytical * 100).toFixed(1)}%`);
  
  // Show all center row displacements
  console.log("\nCenter row (j=2) displacements:");
  for (let i = 0; i <= nDiv; i++) {
    const ni = Math.floor(nDiv/2) * (nDiv+1) + i;
    const d = result?.deformations?.get(ni);
    if (d) console.log(`  N${ni} (x=${(i/nDiv).toFixed(2)}): wy=${d[1].toExponential(4)}`);
  }
} catch (e: any) {
  console.error("ERROR:", e.message);
  console.error(e.stack?.split('\n').slice(0, 5).join('\n'));
}
