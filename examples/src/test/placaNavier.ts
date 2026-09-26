/**
 * Placa cuadrada simplemente apoyada, carga uniforme — los MOMENTOS contra Navier y SAP2000.
 *
 * Es el caso de `tests/casos/placa_momentos_navier.mjs`, puesto a la vista: la misma malla,
 * el mismo Shell-Thick, el mismo `deform` + `analyze` que el resto de la app.
 *
 * Que se ve (y con que numeros se compara, SAP2000 primero):
 *   - M11 en el centro: Navier (serie de Timoshenko, cap. 5 §30) 7.0724 kN·m/m; SAP2000 24 da
 *     7.4169 (+4.9 %); Hekatan 7.1991 (+1.8 %) con 8×8, t = 0.2, E = 2.5e7, ν = 0.2, q = 10.
 *   - Elige «Bending XX / YY / XY» en el selector de resultados para ver el mapa de momentos.
 *   - En el borde apoyado el momento exacto es CERO: el colormap lo muestra, y por eso el test
 *     compara con SAP el momento MEDIO de cada elemento y no joint a joint (la placa gruesa de
 *     CSI lleva w cubico y da −1.40 en ese borde; ver registros/2026-09-17_placa_momentos_43pct.md).
 *
 * Categoria: "test"
 */
import { deform, analyze, type Node, type Element } from "hekatan-fem";
import type { ExampleDef } from "../workspace/exampleRegistry";

type Sup = [boolean, boolean, boolean, boolean, boolean, boolean];
type Car = [number, number, number, number, number, number];

/** Serie de Navier: flecha y M11 (signo CSI: positivo = tracción abajo) en el centro. */
function navierCentro(A: number, E: number, nu: number, t: number, q: number) {
  const D = (E * t ** 3) / (12 * (1 - nu * nu));
  let w = 0, mx = 0;
  for (let m = 1; m < 60; m += 2) {
    for (let n = 1; n < 60; n += 2) {
      const k = (m / A) ** 2 + (n / A) ** 2;
      const s = Math.sin((m * Math.PI) / 2) * Math.sin((n * Math.PI) / 2);
      w += s / (m * n * k * k);
      mx += ((m / A) ** 2 + nu * (n / A) ** 2) * s / (m * n * k * k);
    }
  }
  return { w: (-w * 16 * q) / (Math.PI ** 6 * D), m11: (mx * 16 * q) / Math.PI ** 4 };
}

export const placaNavier: ExampleDef = {
  id: "placa-navier",
  name: "Placa apoyada — momentos vs Navier y SAP2000",
  category: "2️⃣ Shells · 🧱 Placas",
  benchmark: true,
  defaultShellResult: "bendingXX",
  availableShellResults: [
    "none", "pressure",
    "membraneXX", "membraneYY", "membraneXY", "vonMises",
    "bendingXX", "bendingYY", "bendingXY",
    "bendingPrincipalMax", "bendingPrincipalMin",
    "displacementZ",
  ],
  params: {
    A:  { default: 4, min: 1, max: 10, step: 0.5, label: "lado A (m)" },
    t:  { default: 0.2, min: 0.05, max: 0.6, step: 0.05, label: "t espesor (m)" },
    E:  { default: 2.5e7, min: 1e6, max: 2e8, step: 1e6, label: "E (kN/m²)" },
    nu: { default: 0.2, min: 0, max: 0.45, step: 0.05, label: "ν" },
    q:  { default: 10, min: 1, max: 50, step: 1, label: "q presión ↓ (kN/m²)" },
    N:  { default: 8, min: 2, max: 24, step: 2, label: "N elementos por lado" },
  },
  build(p, states) {
    const N = Math.round(p.N);
    const nodes: Node[] = [], elements: Element[] = [];
    const id = (i: number, j: number) => i * (N + 1) + j;
    for (let i = 0; i <= N; i++) for (let j = 0; j <= N; j++) nodes.push([(i * p.A) / N, (j * p.A) / N, 0]);
    for (let i = 0; i < N; i++)
      for (let j = 0; j < N; j++) elements.push([id(i, j), id(i + 1, j), id(i + 1, j + 1), id(i, j + 1)]);

    // borde apoyado en Uz; el plano y Rz se sujetan aparte (solo w no basta: mecanismo en membrana)
    const supports = new Map<number, Sup>();
    for (let i = 0; i <= N; i++) for (let j = 0; j <= N; j++)
      if (i === 0 || i === N || j === 0 || j === N) supports.set(id(i, j), [false, false, true, false, false, false]);
    supports.set(id(0, 0), [true, true, true, false, false, true]);
    supports.set(id(N, 0), [false, true, true, false, false, true]);

    // presión uniforme repartida al área tributaria de cada nudo (1, 1/2 en borde, 1/4 en esquina)
    const a = (p.A / N) ** 2;
    const loads = new Map<number, Car>();
    for (let i = 0; i <= N; i++) for (let j = 0; j <= N; j++) {
      const f = ((i === 0 || i === N) ? 0.5 : 1) * ((j === 0 || j === N) ? 0.5 : 1);
      loads.set(id(i, j), [0, 0, -p.q * a * f, 0, 0, 0]);
    }

    const thicknesses = new Map<number, number>(), elasticities = new Map<number, number>();
    const poissonsRatios = new Map<number, number>(), densities = new Map<number, number>();
    const plateFormulations = new Map<number, number>();
    elements.forEach((_, e) => {
      thicknesses.set(e, p.t); elasticities.set(e, p.E); poissonsRatios.set(e, p.nu);
      densities.set(e, 0); plateFormulations.set(e, 0);   // 0 = Shell-Thick, como en la OAPI de CSI
    });

    states.nodes.val = nodes;
    states.elements.val = elements;
    states.nodeInputs.val = { supports, loads };
    states.elementInputs.val = { thicknesses, elasticities, poissonsRatios, densities, plateFormulations };
    try {
      states.deformOutputs.val = deform(nodes, elements, { supports, loads }, states.elementInputs.val);
      states.analyzeOutputs.val = analyze(nodes, elements, states.elementInputs.val, states.deformOutputs.val);
      const teo = navierCentro(p.A, p.E, p.nu, p.t, p.q);
      const c = id(N / 2, N / 2);
      const w = states.deformOutputs.val.deformations?.get(c)?.[2] ?? 0;
      // M11 en el nudo central = media de los joints de las 4 cascaras que lo tocan (como lista CSI)
      const bx = states.analyzeOutputs.val.bendingXX;
      const vs: number[] = [];
      elements.forEach((el, e) => { const k = el.indexOf(c); if (k >= 0) vs.push(bx?.get(e)?.[k] ?? NaN); });
      const m11 = vs.reduce((s, v) => s + v, 0) / (vs.length || 1);
      console.log(`[Placa Navier] centro: w = ${(w * 1000).toFixed(4)} mm (Navier ${(teo.w * 1000).toFixed(4)}) · ` +
                  `M11 = ${m11.toFixed(4)} kN·m/m (Navier ${teo.m11.toFixed(4)}; SAP2000 8×8 = 7.4169)`);
    } catch (e) { console.error("placa-navier:", e); }
    states.objects3D.val = [];
  },
};
