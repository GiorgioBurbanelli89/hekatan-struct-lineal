// Reacciones del solver de sólidos (−PEN·u): ¿con qué precisión cierran el equilibrio? Bloque de
// 4×3×5 H8 empotrado en la base con cargas en las tres direcciones en la cara de arriba.
import { empaquetar, R } from "../tests/lib/bundle.mjs";
const h = await empaquetar(`export { hex8Solve } from "${R}/hekatan-fem/src/hex8Cpp";`, "hex8r");
const nx = 4, ny = 3, nz = 5, nodes = [], id = (i, j, k) => (k * (ny + 1) + j) * (nx + 1) + i;
for (let k = 0; k <= nz; k++) for (let j = 0; j <= ny; j++) for (let i = 0; i <= nx; i++) nodes.push([i * 0.5, j * 0.5, k * 0.6]);
const elements = [];
for (let k = 0; k < nz; k++) for (let j = 0; j < ny; j++) for (let i = 0; i < nx; i++)
  elements.push([id(i, j, k), id(i + 1, j, k), id(i + 1, j + 1, k), id(i, j + 1, k), id(i, j, k + 1), id(i + 1, j, k + 1), id(i + 1, j + 1, k + 1), id(i, j + 1, k + 1)]);
const supports = new Map(), loads = new Map();
for (let j = 0; j <= ny; j++) for (let i = 0; i <= nx; i++) { supports.set(id(i, j, 0), [true, true, true]); loads.set(id(i, j, nz), [3, -2, -10]); }
const r = h.hex8Solve({ nodes, elements, E: 2.5e7, nu: 0.2, supports, loads });
const sF = [0, 0, 0], sR = [0, 0, 0];
loads.forEach((f) => f.forEach((v, k) => (sF[k] += v)));
r.reactions.forEach((v) => v.forEach((x, k) => (sR[k] += x)));
console.log("ΣF =", sF.join(", "), " ΣR =", sR.map((v) => v.toFixed(9)).join(", "),
  " residuo relativo =", Math.max(...sF.map((v, k) => Math.abs(v + sR[k]))) / Math.max(...sF.map(Math.abs)));
