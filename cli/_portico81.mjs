export function portico81() {
  const nodes = [[0, 0, 0], [360, 0, 0], [0, 0, 180], [360, 0, 180], [0, 0, 300], [360, 0, 300]];
  const elements = [[0, 2], [1, 3], [2, 3], [2, 4], [3, 5], [4, 5]];
  const I = [248.6, 248.6, 248.6e5, 106.3, 106.3, 248.6e5], E = 30e6;
  const mp = (f) => new Map(elements.map((_, i) => [i, f(i)]));
  const ei = { elasticities: mp(() => E), shearModuli: mp(() => E / 2.6), areas: mp(() => 1e4),
    momentsOfInertiaZ: mp((i) => I[i]), momentsOfInertiaY: mp((i) => I[i]), torsionalConstants: mp((i) => 2 * I[i]),
    shearAreasY: mp(() => -1), shearAreasZ: mp(() => -1), densities: mp(() => 0) };
  const plano = [false, true, false, true, false, true], emp = [true, true, true, true, true, true];
  const ni = { supports: new Map([[0, emp], [1, emp], [2, plano], [3, plano], [4, plano], [5, plano]]),
    masses: new Map([[2, 52500 / 386.088 / 2], [3, 52500 / 386.088 / 2], [4, 25500 / 386.088 / 2], [5, 25500 / 386.088 / 2]]) };
  return { nodes, elements, ni, ei };
}
