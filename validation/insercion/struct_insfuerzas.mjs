import { cargarFem } from "../../tests/lib/bundle.mjs";
const fem = await cargarFem();
const E = 2.5e10, nu = 0.2, b = 0.3, d = 0.5, G = E / (2 * (1 + nu));
for (const [cp, off] of [[10, 0], [8, -d / 2]]) {
  const m = (v) => new Map([[0, v]]);
  const ei = { elasticities: m(E), poissonsRatios: m(nu), shearModuli: m(G), areas: m(b * d), momentsOfInertiaZ: m(b * d ** 3 / 12), momentsOfInertiaY: m(d * b ** 3 / 12), torsionalConstants: m(0.229 * d * b ** 3), densities: m(0) };
  if (off) ei.insertionOffsets = m([off, 0]);
  const ni = { supports: new Map([[0, [true, true, true, true, true, true]]]), loads: new Map([[1, [1e5, 0, -1e5, 0, 0, 0]]]) };
  const nodes = [[0, 0, 0], [4, 0, 0]], el = [[0, 1]];
  const dfo = fem.deform(nodes, el, ni, ei); const a = fem.analyze(nodes, el, ei, dfo);
  const g = (k) => a[k]?.get(0);
  console.log(`CP ${cp}: N ${JSON.stringify(g("normals"))} V ${JSON.stringify(g("shearsY"))} M3 ${JSON.stringify(g("bendingsZ"))} M2 ${JSON.stringify(g("bendingsY"))}`);
}
console.log("SAP CP8: P 1e5, V2 -1e5, M3 sta0 -425000, sta4 -25000 | CP10: M3 sta0 -400000, sta4 0");
