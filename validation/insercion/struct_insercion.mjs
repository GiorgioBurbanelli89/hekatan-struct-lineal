import { readFileSync, existsSync } from "node:fs";
import { cargarFem } from "../../tests/lib/bundle.mjs";
const fem = await cargarFem();
const E = 2.5e10, nu = 0.2, b = 0.3, d = 0.5, G = E / (2 * (1 + nu));
const sap = existsSync("validation/insercion/sap_res.json") ? JSON.parse(readFileSync("validation/insercion/sap_res.json", "utf8")) : {};
const dd = { 10: 0, 8: -d / 2, 2: +d / 2 };
for (const cp of [10, 8, 2]) {
  const nodes = [[0, 0, 0], [4, 0, 0]], elements = [[0, 1]];
  const m = (v) => new Map([[0, v]]);
  const ei = { elasticities: m(E), poissonsRatios: m(nu), shearModuli: m(G), areas: m(b * d),
    momentsOfInertiaZ: m(b * d ** 3 / 12), momentsOfInertiaY: m(d * b ** 3 / 12),
    torsionalConstants: m(0.229 * d * b ** 3), densities: m(0) };
  if (dd[cp]) ei.insertionOffsets = m([dd[cp], 0]);
  const ni = { supports: new Map([[0, [true, true, true, true, true, true]]]), loads: new Map([[1, [1e5, 0, -1e5, 0, 0, 0]]]) };
  const r = fem.deform(nodes, elements, ni, ei);
  const u = r.deformations.get(1);
  const s = sap[cp];
  console.log(`CP ${cp}: Struct ux ${u[0].toExponential(6)} uz ${u[2].toExponential(6)} ry ${u[4].toExponential(6)}` +
    (s ? `\n       SAP    ux ${s.u[0].toExponential(6)} uz ${s.u[2].toExponential(6)} ry ${s.r[1].toExponential(6)}` +
      `   dif ux ${(100 * Math.abs(u[0] - s.u[0]) / Math.abs(s.u[0])).toFixed(5)} % uz ${(100 * Math.abs(u[2] - s.u[2]) / Math.abs(s.u[2])).toFixed(5)} % ry ${(100 * Math.abs(u[4] - s.r[1]) / Math.abs(s.r[1])).toFixed(5)} %` : ""));
}
