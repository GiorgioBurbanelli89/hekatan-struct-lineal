/**
 * PLANTILLA DE CIMENTACIÓN — lo que faltaba en «Nuevo modelo · Plantillas».
 *
 * Jorge, 17-sep-2026: «en plantillas también falta cimentaciones, ojo con eso».
 *
 * Dos tipologías sobre la MISMA rejilla de ejes que el resto de plantillas, para
 * poder abrir el pórtico, ver dónde caen las columnas, y abrir su cimiento:
 *
 *   0 · ZAPATAS AISLADAS + vigas de amarre — una zapata cuadrada bajo cada eje de
 *       columna, con su pedestal, y vigas de amarre entre centros de zapata.
 *   1 · LOSA DE CIMENTACIÓN — un solo paño bajo toda la planta, con vuelo.
 *
 * El suelo es Winkler, igual que en `zapata-aislada` (validado contra SAFE):
 * muelle vertical `k = ks · A_tributaria` en cada nudo, muelles horizontales
 * `kh = ks/2 · A` para que el modelo no flote, y tres muelles de giro
 * minúsculos en UN nudo para quitarle el último sólido rígido. NO se ponen
 * apoyos: una cimentación sobre muelles no tiene apoyos, y ponerlos se lleva
 * por delante justo la reacción del terreno que se quiere ver.
 *
 * La formulación por defecto es SHELL-THIN, que es lo que pone SAFE: su propiedad
 * de zapata de fábrica (`Footing1`) sale con «Modeling Type = Shell-Thin» en el
 * .f2k que escribe él mismo. Se deja Shell-Thick como opción porque un cimiento de
 * 45 cm de canto y 2 m de lado tiene t/L = 0.22 —placa gruesa— y con Kirchhoff se
 * pierde el cortante, que es lo que decide el punzonamiento. Se elige, no se supone.
 */
import { deform, analyze, type Node, type Element } from "hekatan-fem";

const CIM_ZAPATAS = 0;
const CIM_LOSA = 1;

/** Ordenadas de una rejilla uniforme, con el mismo criterio que `plantillas.ts`. */
const rejilla = (n: number, s: number) =>
  Array.from({ length: Math.max(2, Math.round(n)) }, (_, i) => i * s);

/** Parte cada tramo en trozos de tamaño ≤ ms, sin bajar de 2 por tramo. */
function partir(v: number[], ms: number): number[] {
  const out: number[] = [];
  for (let i = 0; i < v.length - 1; i++) {
    // ⚠️ el 1e-9: el deslizador entrega 0.49999999999999994 en vez de 0.5, y
    // `ceil(1/0.4999…)` da 3 donde toca 2 — la malla se DUPLICABA sola y dos
    // corridas con el mismo `ms` salian con mallas distintas.
    const d = Math.max(2, Math.ceil((v[i + 1] - v[i]) / Math.max(0.05, ms) - 1e-9));
    for (let k = 0; k < d; k++) out.push(v[i] + ((v[i + 1] - v[i]) * k) / d);
  }
  out.push(v[v.length - 1]);
  return out;
}

export function construirCimentacion(p: any, states: any) {
  const sub = Math.round(p.cimTipo ?? CIM_ZAPATAS);
  const X = rejilla(p.nx, p.sx), Y = rejilla(p.ny, p.sy);
  const E = (p.Ec ?? 2.2e7) as number, nu = 0.2, rho = 2.4;
  const Gc = E / (2 * (1 + nu));
  const B = Math.max(0.6, p.zapB ?? 2.0);          // lado de zapata (m)
  const hz = Math.max(0.15, p.zapH ?? 0.45);       // canto de zapata (m)
  const ks = Math.max(100, p.ks ?? 20000);         // balasto (kN/m3)
  const P = p.Pcol ?? 400;                         // carga por columna (kN)
  const hped = Math.max(0.2, p.hped ?? 0.8);       // pedestal (m)
  const ms = Math.max(0.15, p.ms ?? 0.5);
  // 1 = Shell-Thin (DKQ), 0 = Shell-Thick (Mindlin). El defecto es THIN porque es
  // lo que pone SAFE: su `Footing1` de fábrica sale «Modeling Type = Shell-Thin»
  // en el .f2k que escribe él (validation/04-cimentaciones-safe/zapata-aislada).
  const formul = Math.round(p.zapForm ?? 1);

  const nodes: Node[] = [], elements: Element[] = [];
  const clave = new Map<string, number>();
  const nudo = (x: number, y: number, z: number) => {
    const k = `${x.toFixed(4)},${y.toFixed(4)},${z.toFixed(4)}`;
    let i = clave.get(k);
    if (i === undefined) { i = nodes.length; nodes.push([x, y, z]); clave.set(k, i); }
    return i;
  };
  const elasticities = new Map<number, number>(), poissonsRatios = new Map<number, number>();
  const shearModuli = new Map<number, number>(), densities = new Map<number, number>();
  const areas = new Map<number, number>(), momentsOfInertiaY = new Map<number, number>();
  const momentsOfInertiaZ = new Map<number, number>(), torsionalConstants = new Map<number, number>();
  const thicknesses = new Map<number, number>(), plateFormulations = new Map<number, number>();
  const loads = new Map<number, number[]>();
  const areaNudo = new Map<number, number>();      // área tributaria, para el muelle

  const ponerPano = (a: number, b: number, c: number, d: number, t: number, area: number) => {
    const e = elements.length;
    elements.push([a, b, c, d]);
    elasticities.set(e, E); poissonsRatios.set(e, nu); shearModuli.set(e, Gc);
    densities.set(e, rho); thicknesses.set(e, t); plateFormulations.set(e, formul);
    for (const n of [a, b, c, d]) areaNudo.set(n, (areaNudo.get(n) ?? 0) + area / 4);
  };
  const ponerBarra = (a: number, b: number, bw: number, hh: number) => {
    const e = elements.length;
    elements.push([a, b]);
    elasticities.set(e, E); poissonsRatios.set(e, nu); shearModuli.set(e, Gc); densities.set(e, rho);
    areas.set(e, bw * hh);
    momentsOfInertiaY.set(e, (hh * bw ** 3) / 12);     // I22, plano 1-3
    momentsOfInertiaZ.set(e, (bw * hh ** 3) / 12);     // I33, el del canto
    const a1 = Math.max(bw, hh), b1 = Math.min(bw, hh);
    torsionalConstants.set(e, a1 * b1 ** 3 * (1 / 3 - 0.21 * (b1 / a1) * (1 - b1 ** 4 / (12 * a1 ** 4))));
  };

  // ── la malla del cimiento ────────────────────────────────────────────────
  const centros: number[] = [];                    // nudo bajo cada eje de columna
  if (sub === CIM_LOSA) {
    const vol = Math.max(0, p.volado ?? 0.5);
    const xs = partir([X[0] - vol, ...X, X[X.length - 1] + vol], ms);
    const ys = partir([Y[0] - vol, ...Y, Y[Y.length - 1] + vol], ms);
    const id: number[][] = ys.map((y) => xs.map((x) => nudo(x, y, 0)));
    for (let j = 0; j < ys.length - 1; j++)
      for (let i = 0; i < xs.length - 1; i++)
        ponerPano(id[j][i], id[j][i + 1], id[j + 1][i + 1], id[j + 1][i],
                  p.losaH ?? 0.50, (xs[i + 1] - xs[i]) * (ys[j + 1] - ys[j]));
    for (const y of Y) for (const x of X) centros.push(nudo(x, y, 0));
  } else {
    for (const y of Y) for (const x of X) {
      const xs = partir([x - B / 2, x, x + B / 2], ms);
      const ys = partir([y - B / 2, y, y + B / 2], ms);
      const id: number[][] = ys.map((yy) => xs.map((xx) => nudo(xx, yy, 0)));
      for (let j = 0; j < ys.length - 1; j++)
        for (let i = 0; i < xs.length - 1; i++)
          ponerPano(id[j][i], id[j][i + 1], id[j + 1][i + 1], id[j + 1][i],
                    hz, (xs[i + 1] - xs[i]) * (ys[j + 1] - ys[j]));
      centros.push(nudo(x, y, 0));
    }
    // vigas de amarre entre centros de zapata contiguos, a la cota de la zapata
    const centro = (i: number, j: number) => centros[j * X.length + i];
    for (let j = 0; j < Y.length; j++) for (let i = 0; i < X.length - 1; i++)
      ponerBarra(centro(i, j), centro(i + 1, j), p.bva ?? 0.30, p.hva ?? 0.40);
    for (let i = 0; i < X.length; i++) for (let j = 0; j < Y.length - 1; j++)
      ponerBarra(centro(i, j), centro(i, j + 1), p.bva ?? 0.30, p.hva ?? 0.40);
  }

  // ── pedestal y carga de columna ──────────────────────────────────────────
  const bcol = p.bcol ?? 0.40;
  for (const n0 of centros) {
    const [x, y] = nodes[n0];
    const n1 = nudo(x, y, hped);
    ponerBarra(n0, n1, bcol, bcol);
    loads.set(n1, [0, 0, -P, 0, 0, 0]);
  }

  // ── el terreno: muelles de Winkler, NO apoyos ────────────────────────────
  const springs: Array<{ node: number; dof: number; k: number }> = [];
  for (const [n, A] of areaNudo) {
    springs.push({ node: n, dof: 2, k: ks * A });
    springs.push({ node: n, dof: 0, k: (ks / 2) * A });
    springs.push({ node: n, dof: 1, k: (ks / 2) * A });
  }
  // el último sólido rígido (el giro sobre Z) se quita con un muelle minúsculo
  const kRot = ks * 1e-4;
  for (const d of [3, 4, 5]) springs.push({ node: centros[0], dof: d, k: kRot });

  states.nodes.val = nodes;
  states.elements.val = elements;
  states.nodeInputs.val = { supports: new Map(), loads, springs } as any;
  states.elementInputs.val = {
    elasticities, poissonsRatios, shearModuli, densities, areas,
    momentsOfInertiaY, momentsOfInertiaZ, torsionalConstants,
    thicknesses, plateFormulations,
  };
  states.objects3D.val = [];
  if (p.__soloModelo) return;
  try {
    states.deformOutputs.val = deform(nodes, elements, states.nodeInputs.val,
                                      states.elementInputs.val, springs);
    states.analyzeOutputs.val = analyze(nodes, elements, states.elementInputs.val,
                                        states.deformOutputs.val);
    // La PRESIÓN del terreno es lo que se mira en un cimiento: q = ks · w.
    // Va como campo de cáscara para que el colormap la pinte como en la zapata.
    const def = states.deformOutputs.val?.deformations;
    if (def) {
      const pres = new Map<number, number[]>();
      for (let e = 0; e < elements.length; e++) {
        const el = elements[e];
        if (el.length !== 4) continue;
        pres.set(e, el.map((n: number) => {
          const w = def.get ? def.get(n)?.[2] : def[n]?.[2];
          return ks * (w ?? 0);           // negativo = el suelo comprimido
        }));
      }
      (states.analyzeOutputs.val as any).pressure = pres;
    }
  } catch (err) {
    console.error("[Cimentación] el solver no cerró:", err);
  }
}
