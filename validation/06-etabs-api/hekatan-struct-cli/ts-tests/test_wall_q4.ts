import { deform } from './hekatan-fem/src/deform.js';

// Same model as ETABS: 1m x 1m wall, t=0.1m, E=2e7, nu=0.2
// Y-up: Y = vertical
const nodes: [number,number,number][] = [
  [0, 0, 0],   // 0: bottom-left
  [1, 0, 0],   // 1: bottom-right
  [1, 1, 0],   // 2: top-right
  [0, 1, 0],   // 3: top-left
];
const elements: number[][] = [[0, 1, 2, 3]];
const nodeInputs = {
  supports: new Map<number, [boolean,boolean,boolean,boolean,boolean,boolean]>([
    [0, [true,true,true,true,true,true]],
    [1, [true,true,true,true,true,true]],
  ]),
  loads: new Map<number, [number,number,number,number,number,number]>([
    [2, [5,0,0,0,0,0]],
    [3, [5,0,0,0,0,0]],
  ]),
};
const elementInputs = {
  elasticities: new Map([[0, 2e7]]),
  thicknesses: new Map([[0, 0.1]]),
  poissonsRatios: new Map([[0, 0.2]]),
};

console.log("=== HEKATAN Shell Q4 vs ETABS ShellThick ===");
console.log("Wall: 1m x 1m, t=0.1m, E=2e7, nu=0.2, 10 tonf lateral");
console.log();

try {
  const result = deform(nodes, elements, nodeInputs, elementInputs);
  
  console.log("DEFORMATIONS:");
  if (result?.deformations) {
    for (const [ni, d] of result.deformations) {
      console.log(`  N${ni}: Ux=${d[0].toExponential(6)} Uy=${d[1].toExponential(6)}`);
    }
  }
  
  console.log("\nREACTIONS:");
  if (result?.reactions) {
    for (const [ni, r] of result.reactions) {
      console.log(`  N${ni}: Fx=${r[0].toFixed(4)} Fy=${r[1].toFixed(4)}`);
    }
  }
  
  const ux = result?.deformations?.get(2)?.[0] ?? 0;
  const etabs = 2.6036e-5;
  console.log("\n=== COMPARISON ===");
  console.log(`ETABS ShellThick: Ux = ${etabs.toExponential(6)} m`);
  console.log(`Hekatan Shell Q4:  Ux = ${ux.toExponential(6)} m`);
  console.log(`Error: ${(Math.abs(ux - etabs)/etabs*100).toFixed(2)}%`);
} catch (e: any) {
  console.error("ERROR:", e.message);
  console.error(e.stack?.split('\n').slice(0,5).join('\n'));
}
