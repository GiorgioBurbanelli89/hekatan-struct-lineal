// Valida el motor C++/WASM (deformCpp) contra el edificio_muro validado en Python.
// node --experimental-strip-types validate_cpp_edificio.ts
import { deformCpp } from "./src/deformCpp.ts";

const E = 2534564, nu = 0.20, rho = 2.40277, G = E / (2 * (1 + nu));
const LX = 4, LY = 4, H = 3, ms = 1;
const tW = 0.25, tS = 0.10;
const nx = LX / ms, ny = LY / ms, nz = H / ms;

const nodes: number[][] = [];
const key2id = new Map<string, number>();
const nid = (x: number, y: number, z: number) => {
  const k = `${x.toFixed(4)},${y.toFixed(4)},${z.toFixed(4)}`;
  let id = key2id.get(k);
  if (id === undefined) { id = nodes.length; nodes.push([x, y, z]); key2id.set(k, id); }
  return id;
};
const elements: number[][] = [];
const kinds: string[] = [];
// MURO X=0 (Y x Z)
for (let j = 0; j < ny; j++) for (let k = 0; k < nz; k++) {
  elements.push([nid(0, j * ms, k * ms), nid(0, (j + 1) * ms, k * ms), nid(0, (j + 1) * ms, (k + 1) * ms), nid(0, j * ms, (k + 1) * ms)]); kinds.push("wall");
}
// LOSA Z=H (X x Y)
for (let i = 0; i < nx; i++) for (let j = 0; j < ny; j++) {
  elements.push([nid(i * ms, j * ms, H), nid((i + 1) * ms, j * ms, H), nid((i + 1) * ms, (j + 1) * ms, H), nid(i * ms, (j + 1) * ms, H)]); kinds.push("slab");
}
// COLUMNAS X=LX en (LX,0),(LX,LY)
for (const yv of [0, LY]) for (let k = 0; k < nz; k++) {
  elements.push([nid(LX, yv, k * ms), nid(LX, yv, (k + 1) * ms)]); kinds.push("col");
}
// VIGAS perimetrales Z=H
for (let i = 0; i < nx; i++) { elements.push([nid(i * ms, 0, H), nid((i + 1) * ms, 0, H)]); kinds.push("beam"); }
for (let i = 0; i < nx; i++) { elements.push([nid(i * ms, LY, H), nid((i + 1) * ms, LY, H)]); kinds.push("beam"); }
for (let j = 0; j < ny; j++) { elements.push([nid(LX, j * ms, H), nid(LX, (j + 1) * ms, H)]); kinds.push("beam"); }
for (let j = 0; j < ny; j++) { elements.push([nid(0, j * ms, H), nid(0, (j + 1) * ms, H)]); kinds.push("beam"); }

const A_c = 0.4 * 0.4, I_c = 0.4 ** 4 / 12, J_c = 0.141 * 0.4 ** 4;
const A_v = 0.3 * 0.5, Iy_v = 0.3 * 0.5 ** 3 / 12, Iz_v = 0.5 * 0.3 ** 3 / 12, J_v = 0.3 * 0.5 ** 3 / 12 + 0.5 * 0.3 ** 3 / 12;

const thicknesses = new Map(), elasticities = new Map(), poissonsRatios = new Map(),
  densities = new Map(), plateFormulations = new Map(), drillingTypes = new Map(),
  areas = new Map(), momentsOfInertiaY = new Map(), momentsOfInertiaZ = new Map(),
  torsionalConstants = new Map(), shearModuli = new Map();
kinds.forEach((k, e) => {
  elasticities.set(e, E); poissonsRatios.set(e, nu); densities.set(e, rho);
  if (k === "wall" || k === "slab") {
    thicknesses.set(e, k === "wall" ? tW : tS);
    plateFormulations.set(e, 1);   // 1 = Kirchhoff MZC (Shell-Thin DKE)
    drillingTypes.set(e, 2);       // 2 = Hughes-Brezzi
  } else {
    shearModuli.set(e, G);
    if (k === "col") { areas.set(e, A_c); momentsOfInertiaY.set(e, I_c); momentsOfInertiaZ.set(e, I_c); torsionalConstants.set(e, J_c); }
    else { areas.set(e, A_v); momentsOfInertiaY.set(e, Iy_v); momentsOfInertiaZ.set(e, Iz_v); torsionalConstants.set(e, J_v); }
  }
});
const supports = new Map(), loads = new Map();
nodes.forEach((p, i) => { if (Math.abs(p[2]) < 1e-9) supports.set(i, [true, true, true, true, true, true]); });
const top = nodes.map((p, i) => [p, i]).filter(([p]: any) => Math.abs(p[2] - H) < 1e-9).map(([, i]: any) => i);
for (const i of top) loads.set(i, [0, 10 / top.length, 0, 0, 0, 0]);

const out = await deformCpp(nodes as any, elements as any, { supports, loads } as any, {
  thicknesses, elasticities, poissonsRatios, densities, plateFormulations, drillingTypes,
  areas, momentsOfInertiaY, momentsOfInertiaZ, torsionalConstants, shearModuli,
} as any);
let uymax = 0, uymean = 0;
for (const i of top) { const uy = out.deformations.get(i)[1]; uymax = Math.max(uymax, Math.abs(uy)); uymean += Math.abs(uy); }
uymean /= top.length;
console.log(`C++ (WASM) edificio_muro lateral P=10/Y:`);
console.log(`  nodos=${nodes.length} shells=${kinds.filter(k=>k=="wall"||k=="slab").length} frames=${kinds.filter(k=>k=="col"||k=="beam").length} top=${top.length}`);
console.log(`  uy_top  max=${(uymax*1000).toFixed(4)} mm  mean=${(uymean*1000).toFixed(4)} mm`);
console.log(`  Python(numpy) ref: max=0.9859 mm  mean=0.5173 mm`);
console.log(`  dif max = ${((uymax*1000-0.9859)/0.9859*100).toFixed(2)}%   dif mean = ${((uymean*1000-0.5173)/0.5173*100).toFixed(2)}%`);
