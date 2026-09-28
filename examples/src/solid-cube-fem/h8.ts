/**
 * El solver H8 está en el paquete del motor (`hekatan-fem/src/hex8Cpp.ts`).
 * Este fichero queda solo para que sigan valiendo los `import … from "../solid-cube-fem/h8"`
 * de los tests y de los guiones de `cli/`.
 */
export { hex8Solve, hex8Stress } from "hekatan-fem";
export type { Vec3, Hex8, Hex8SolveInput, Hex8SolveOutput } from "hekatan-fem";
