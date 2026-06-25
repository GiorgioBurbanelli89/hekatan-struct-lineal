/**
 * Edificio 4 pisos rectangular con VOLADOS de 1 m en 3 lados, esquinas en ARCO,
 * vigas de borde y columnas de hormigón armado. Losa ShellThin DKE (validada vs
 * ETABS/Python). Geometría paramétrica.  (Corre en el motor C++: w_max ✓, volado ✓)
 */
import type { ExampleDef } from "../workspace/exampleRegistry";
import type { Node, Element } from "hekatan-fem";

export const edificioVoladosArco: ExampleDef = {
  id: "edificio-volados-arco",
  name: "🏢 Edificio volados + arco (4 pisos)",
  category: "Edificios",
  params: {
    sx:      { default: 5, min: 3, max: 8, step: 0.5, label: "Vano X [m]", folder: "Geometría" },
    sy:      { default: 5, min: 3, max: 8, step: 0.5, label: "Vano Y [m]", folder: "Geometría" },
    nbx:     { default: 2, min: 1, max: 4, step: 1, label: "Vanos X", folder: "Geometría" },
    nby:     { default: 2, min: 1, max: 4, step: 1, label: "Vanos Y", folder: "Geometría" },
    cant:    { default: 1.0, min: 0.5, max: 2.0, step: 0.25, label: "Volado [m]", folder: "Geometría" },
    nFloors: { default: 4, min: 1, max: 8, step: 1, label: "N° pisos", folder: "Geometría" },
    hFloor:  { default: 3, min: 2.5, max: 4, step: 0.1, label: "Altura piso [m]", folder: "Geometría" },
    ms:      { default: 1.0, min: 0.5, max: 2.0, step: 0.5, label: "Malla losa [m]", folder: "Geometría" },
    tSlab:   { default: 0.20, min: 0.10, max: 0.35, step: 0.01, label: "Espesor losa [m]", folder: "Secciones" },
    bCol:    { default: 0.40, min: 0.25, max: 0.70, step: 0.05, label: "Columna b [m]", folder: "Secciones" },
    bBeam:   { default: 0.30, min: 0.20, max: 0.50, step: 0.05, label: "Viga b [m]", folder: "Secciones" },
    hBeam:   { default: 0.50, min: 0.30, max: 0.80, step: 0.05, label: "Viga h [m]", folder: "Secciones" },
    q:       { default: 1.0, min: 0, max: 2.0, step: 0.1, label: "Carga losa [tonf/m²]", folder: "Cargas" },
  },
  hasModal: true,
  defaultShellResult: "displacementZ",
  availableShellResults: ["displacementZ", "bendingXX", "bendingYY", "bendingXY", "vonMises"],

  build(p, states) {
    const E = 2534564, nu = 0.20, rho = 2.40277, G = E / (2 * (1 + nu));
    const { sx, sy, nbx, nby, cant, nFloors, hFloor, ms, tSlab, bCol, bBeam, hBeam, q } = p as any;
    const Lx = sx * nbx, Ly = sy * nby;

    // contorno: rectángulo + volado en +X, +Y, −Y (−X a ras); 2 esquinas en arco
    const x0 = 0, x1 = Lx + cant, y0 = -cant, y1 = Ly + cant;
    const inside = (xc: number, yc: number) => {
      if (xc < x0 - 1e-9 || xc > x1 + 1e-9 || yc < y0 - 1e-9 || yc > y1 + 1e-9) return false;
      if (xc > Lx && yc > Ly) return (xc - Lx) ** 2 + (yc - Ly) ** 2 <= cant * cant + 1e-9;
      if (xc > Lx && yc < 0) return (xc - Lx) ** 2 + (yc - 0) ** 2 <= cant * cant + 1e-9;
      return true;
    };

    const nodes: Node[] = []; const key = new Map<string, number>();
    const nid = (x: number, y: number, z: number) => {
      const k = `${x.toFixed(3)},${y.toFixed(3)},${z.toFixed(3)}`;
      let i = key.get(k); if (i === undefined) { i = nodes.length; nodes.push([x, y, z]); key.set(k, i); } return i;
    };
    const elements: Element[] = []; const kinds: string[] = [];
    const nx = Math.round((x1 - x0) / ms), ny = Math.round((y1 - y0) / ms);
    const colXY: [number, number][] = [];
    for (let i = 0; i <= nbx; i++) for (let j = 0; j <= nby; j++) colXY.push([i * sx, j * sy]);

    for (let f = 1; f <= nFloors; f++) {
      const z = f * hFloor;
      for (let i = 0; i < nx; i++) for (let j = 0; j < ny; j++) {
        const xa = x0 + i * ms, ya = y0 + j * ms;
        if (!inside(xa + ms / 2, ya + ms / 2)) continue;
        elements.push([nid(xa, ya, z), nid(xa + ms, ya, z), nid(xa + ms, ya + ms, z), nid(xa, ya + ms, z)]);
        kinds.push("slab");
      }
      // vigas de borde = aristas de losa de este piso que aparecen 1 sola vez
      const cnt = new Map<string, { a: number; b: number; n: number }>();
      for (let e = 0; e < elements.length; e++) {
        if (kinds[e] !== "slab" || Math.abs(nodes[elements[e][0]][2] - z) > 1e-6) continue;
        const Q = elements[e];
        for (let s = 0; s < 4; s++) {
          const a = Q[s], b = Q[(s + 1) % 4], k = a < b ? `${a}-${b}` : `${b}-${a}`;
          const o = cnt.get(k); cnt.set(k, o ? { a: o.a, b: o.b, n: o.n + 1 } : { a, b, n: 1 });
        }
      }
      for (const { a, b, n } of cnt.values()) if (n === 1) { elements.push([a, b]); kinds.push("beam"); }
    }
    // columnas H°A° (de base a cada piso)
    for (const [x, y] of colXY) for (let f = 0; f < nFloors; f++) {
      elements.push([nid(x, y, f * hFloor), nid(x, y, (f + 1) * hFloor)]); kinds.push("col");
    }

    // inputs
    const A_c = bCol * bCol, I_c = bCol ** 4 / 12, J_c = 0.141 * bCol ** 4;
    const A_v = bBeam * hBeam, Iy_v = bBeam * hBeam ** 3 / 12, Iz_v = hBeam * bBeam ** 3 / 12,
      J_v = bBeam * hBeam ** 3 / 12 + hBeam * bBeam ** 3 / 12;
    const m = <T,>() => new Map<number, T>();
    const elasticities = m<number>(), poissonsRatios = m<number>(), shearModuli = m<number>(),
      densities = m<number>(), areas = m<number>(), momentsOfInertiaY = m<number>(),
      momentsOfInertiaZ = m<number>(), torsionalConstants = m<number>(), thicknesses = m<number>(),
      plateFormulations = m<number>(), drillingTypes = m<number>();
    kinds.forEach((k, e) => {
      elasticities.set(e, E); poissonsRatios.set(e, nu); densities.set(e, rho); shearModuli.set(e, G);
      if (k === "slab") { thicknesses.set(e, tSlab); plateFormulations.set(e, 1); drillingTypes.set(e, 2); }
      else if (k === "col") { areas.set(e, A_c); momentsOfInertiaY.set(e, I_c); momentsOfInertiaZ.set(e, I_c); torsionalConstants.set(e, J_c); }
      else { areas.set(e, A_v); momentsOfInertiaY.set(e, Iy_v); momentsOfInertiaZ.set(e, Iz_v); torsionalConstants.set(e, J_v); }
    });

    const supports = new Map<number, boolean[]>();
    nodes.forEach((pt, i) => { if (Math.abs(pt[2]) < 1e-9) supports.set(i, [true, true, true, true, true, true]); });
    const loads = new Map<number, number[]>();
    kinds.forEach((k, e) => {
      if (k !== "slab") return;
      for (const n of elements[e]) { const c = loads.get(n) ?? [0, 0, 0, 0, 0, 0]; c[2] -= q * ms * ms / 4; loads.set(n, c); }
    });

    states.nodes.val = nodes;
    states.elements.val = elements;
    states.nodeInputs.val = { supports, loads } as any;
    states.elementInputs.val = {
      elasticities, poissonsRatios, shearModuli, densities,
      areas, momentsOfInertiaY, momentsOfInertiaZ, torsionalConstants,
      thicknesses, plateFormulations, drillingTypes,
    } as any;
  },
};
