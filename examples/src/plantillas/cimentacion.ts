/**
 * PLANTILLAS DE CIMENTACIÓN — las tipologías de verdad, no una sola.
 *
 * Jorge, 17-sep-2026: «faltan plantillas de cimentación: zapata aislada, zapata con
 * vigas de amarre, zapata combinada, zapata esquinera, zapata de lindero».
 *
 *   2 · AISLADA          una zapata, columna centrada. El caso de libro.
 *   0 · REJILLA + AMARRE una zapata bajo cada eje, atadas con vigas de amarre.
 *   3 · COMBINADA        dos columnas sobre UNA zapata rectangular.
 *   4 · DE LINDERO       la columna con su cara en la línea de propiedad: la carga
 *                        es EXCÉNTRICA, y se compensa con viga centradora a una
 *                        zapata interior. Sin esa viga, la zapata vuelca.
 *   5 · ESQUINERA        columna en la esquina: excéntrica en las DOS direcciones,
 *                        con dos vigas centradoras.
 *   6 · VIGA EN T INVERTIDA  emparrillado de vigas de cimentación como FRAME, con
 *                        sección T invertida de verdad (ala abajo, alma arriba).
 *   1 · LOSA (mat)       un solo paño bajo toda la planta, con vuelo.
 *
 * Todo sale del MISMO motor: una lista de zapatas (rectángulos), una lista de
 * columnas (punto + carga) y una lista de vigas. Tenerlo en un solo sitio es lo que
 * evita que una tipología se quede sin el arreglo que se le hizo a otra.
 *
 * TRES COSAS QUE NO SON DE ADORNO, y por qué:
 *
 * · El suelo son MUELLES de Winkler, no apoyos (`kv = ks·A_trib`), como en
 *   `zapata-aislada`, que está validado contra SAFE. Poner apoyos se lleva por
 *   delante justo la reacción del terreno que se quiere ver.
 * · La malla se parte en el CONTORNO de cada columna (`xc ± b/2`) y la carga entra
 *   repartida por esa huella. Es el «X Dimension / Y Dimension — dimension of the
 *   load … for punching shear checks at the joint» que guarda SAFE en el nudo
 *   (leído de SAFE.exe). Metiendo la carga en un nudo salen picos que no existen.
 * · La formulación por defecto es Shell-THICK. SAFE trae Shell-Thin de fábrica en su
 *   `Footing1` (lo escribe él en el .f2k), pero su propio manual dice que el cortante
 *   importa cuando el canto pasa de 1/10 a 1/5 de la luz y que «it is generally
 *   recommended that you use the thick-plate formulation». Una zapata de 2.00 m con
 *   0.45 m de canto está en t/L = 0.22. El Thin queda a un clic para reproducir SAFE.
 *
 * ⚠️ LO QUE ESTE MODELO NO HACE: el muelle es LINEAL, así que puede trabajar a
 * TRACCIÓN. En una zapata de lindero o esquinera, que son excéntricas de nacimiento,
 * eso significa que una esquina puede "colgarse" del terreno en vez de despegarse.
 * SAFE tiene para eso el muelle de área «Compression Only», que es NO lineal. Por eso
 * la salida avisa de cuántos nudos quedaron levantados: si son muchos, el reparto de
 * presiones de ese caso no vale y hay que agrandar la zapata o la viga centradora.
 */
import { deform, analyze, type Node, type Element } from "hekatan-fem";

export const CIM_REJILLA = 0;
export const CIM_LOSA = 1;
export const CIM_AISLADA = 2;
export const CIM_COMBINADA = 3;
export const CIM_LINDERO = 4;
export const CIM_ESQUINERA = 5;
export const CIM_VIGA_T = 6;

/** Ordenadas de una rejilla uniforme, con el mismo criterio que `plantillas.ts`. */
const rejilla = (n: number, s: number) =>
  Array.from({ length: Math.max(2, Math.round(n)) }, (_, i) => i * s);

/** Parte cada tramo en trozos de tamaño ≤ ms, sin bajar de 2 por tramo. */
function partir(v: number[], ms: number): number[] {
  const out: number[] = [];
  for (let i = 0; i < v.length - 1; i++) {
    // ⚠️ el 1e-9: el deslizador entrega 0.49999999999999994 en vez de 0.5, y
    // `ceil(1/0.4999…)` da 3 donde toca 2 — la malla se DUPLICABA sola.
    const d = Math.max(2, Math.ceil((v[i + 1] - v[i]) / Math.max(0.05, ms) - 1e-9));
    for (let k = 0; k < d; k++) out.push(v[i] + ((v[i + 1] - v[i]) * k) / d);
  }
  out.push(v[v.length - 1]);
  return out;
}

/**
 * Mete cortes OBLIGATORIOS en una lista de ordenadas y quita los repetidos.
 * Sirve para que la malla pase por el CONTORNO de la columna: sin esos cortes, una
 * columna de 0.40 m dentro de una malla de 0.50 m no tiene ni un nudo propio y su
 * carga acaba entrando por el nudo del eje. Es el «cookie-cut» de ETABS.
 */
function conCortes(v: number[], cortes: number[], tol = 1e-6): number[] {
  const out = [...v];
  for (const c of cortes) {
    if (c < v[0] - tol || c > v[v.length - 1] + tol) continue;
    if (out.some((q) => Math.abs(q - c) < tol)) continue;
    out.push(c);
  }
  return out.sort((a, b) => a - b);
}

/**
 * Sección en T INVERTIDA: el ala abajo (la que apoya en el terreno) y el alma
 * arriba. Es la viga de cimentación de toda la vida, y como elemento FRAME hay que
 * darle A, las dos inercias y J de verdad — no las de un rectángulo equivalente,
 * que es lo que la deja dos o tres veces más rígida de lo que es.
 *
 *   bf, tf = ancho y canto del ALA (abajo)      bw, h = ancho del ALMA y canto TOTAL
 *
 * El eje neutro no está a media altura: se calcula, y la inercia va con Steiner.
 * J con la regla de pared delgada de Roark, la misma que `cadSections.ts` usa para
 * el perfil I y la canal: Σ (b·t³/3)·(1 − 0.63·t/b).
 */
function seccionTInvertida(bf: number, tf: number, bw: number, h: number) {
  const hw = Math.max(1e-6, h - tf);                       // alto del alma
  const A1 = bf * tf, A2 = bw * hw;                        // ala y alma
  const A = A1 + A2;
  const y1 = tf / 2, y2 = tf + hw / 2;                     // centroides desde la base
  const yc = (A1 * y1 + A2 * y2) / A;                      // eje neutro
  // I33: flexión en el plano del canto (la que trabaja bajo la columna)
  const I33 = (bf * tf ** 3) / 12 + A1 * (yc - y1) ** 2
            + (bw * hw ** 3) / 12 + A2 * (yc - y2) ** 2;
  // I22: flexión horizontal
  const I22 = (tf * bf ** 3) / 12 + (hw * bw ** 3) / 12;
  const jRect = (b: number, t: number) => {
    const a1 = Math.max(b, t), b1 = Math.min(b, t);
    return (a1 * b1 ** 3 / 3) * (1 - 0.63 * (b1 / a1));
  };
  const J = jRect(bf, tf) + jRect(hw, bw);
  return { A, I22, I33, J, yc };
}

/** Una zapata: rectángulo en planta y canto. */
interface Zapata { x0: number; y0: number; x1: number; y1: number; t: number; }
/** Una columna: dónde cae su EJE, su lado y la carga que baja. */
interface Columna { x: number; y: number; b: number; P: number; }

export function construirCimentacion(p: any, states: any, sub = CIM_REJILLA) {
  const E = (p.Ec ?? 2.2e7) as number, nu = 0.2, rho = 2.4;
  const Gc = E / (2 * (1 + nu));
  const B = Math.max(0.6, p.zapB ?? 2.0);          // lado de zapata (m)
  const hz = Math.max(0.15, p.zapH ?? 0.45);       // canto de zapata (m)
  const ks = Math.max(100, p.ks ?? 20000);         // balasto (kN/m3)
  const P = p.Pcol ?? 400;                         // carga por columna (kN)
  const hped = Math.max(0.2, p.hped ?? 0.8);       // pedestal (m)
  const ms = Math.max(0.15, p.ms ?? 0.5);
  const bcol = p.bcol ?? 0.40;
  const bva = p.bva ?? 0.30, hva = p.hva ?? 0.40;
  const formul = Math.round(p.zapForm ?? 0);       // 0 = Shell-Thick, 1 = Shell-Thin
  const sx = p.sx ?? 5, sy = p.sy ?? 5;

  // ── 1. la GEOMETRÍA de cada tipología, en datos ──────────────────────────
  const zapatas: Zapata[] = [];
  const columnas: Columna[] = [];
  const vigas: Array<[number, number, number, number]> = [];   // x0,y0 → x1,y1
  let X: number[] = [], Y: number[] = [];
  const cuadrada = (xc: number, yc: number, lado: number) =>
    zapatas.push({ x0: xc - lado / 2, y0: yc - lado / 2, x1: xc + lado / 2, y1: yc + lado / 2, t: hz });

  if (sub === CIM_LOSA) {
    X = rejilla(p.nx, sx); Y = rejilla(p.ny, sy);
    const vol = Math.max(0.5, p.volCim ?? 1.0);
    zapatas.push({ x0: X[0] - vol, y0: Y[0] - vol,
                   x1: X[X.length - 1] + vol, y1: Y[Y.length - 1] + vol, t: p.losaH ?? 0.50 });
    for (const y of Y) for (const x of X) columnas.push({ x, y, b: bcol, P });

  } else if (sub === CIM_REJILLA) {
    X = rejilla(p.nx, sx); Y = rejilla(p.ny, sy);
    for (const y of Y) for (const x of X) { cuadrada(x, y, B); columnas.push({ x, y, b: bcol, P }); }
    for (const y of Y) for (let i = 0; i < X.length - 1; i++) vigas.push([X[i], y, X[i + 1], y]);
    for (const x of X) for (let j = 0; j < Y.length - 1; j++) vigas.push([x, Y[j], x, Y[j + 1]]);

  } else if (sub === CIM_AISLADA) {
    cuadrada(0, 0, B);
    columnas.push({ x: 0, y: 0, b: bcol, P });

  } else if (sub === CIM_COMBINADA) {
    // Dos columnas sobre UNA zapata. Con cargas iguales, el centro de gravedad de
    // las cargas cae en el punto medio: la zapata se centra ahí y la presión sale
    // uniforme. Ése es el motivo de ser de la combinada.
    const vol = Math.max(0.4, p.volZap ?? 0.6);
    zapatas.push({ x0: -vol - bcol / 2, y0: -B / 2, x1: sx + vol + bcol / 2, y1: B / 2, t: hz });
    columnas.push({ x: 0, y: 0, b: bcol, P }, { x: sx, y: 0, b: bcol, P });

  } else if (sub === CIM_LINDERO) {
    // La CARA de la columna toca la línea de propiedad (x = 0): la zapata no puede
    // pasar de ahí, así que su eje queda en B/2 y la columna en bcol/2 —
    // excentricidad e = B/2 − bcol/2. La viga centradora lleva ese momento a la
    // zapata interior, que es lo que impide que vuelque.
    zapatas.push({ x0: 0, y0: -B / 2, x1: B, y1: B / 2, t: hz });
    columnas.push({ x: bcol / 2, y: 0, b: bcol, P });
    cuadrada(sx, 0, B);
    columnas.push({ x: sx, y: 0, b: bcol, P });
    vigas.push([bcol / 2, 0, sx, 0]);

  } else if (sub === CIM_VIGA_T) {
    // Emparrillado de vigas de cimentación: NO hay paño de cáscara, solo frames con
    // sección T invertida apoyados en el terreno. Los muelles van por METRO de viga,
    // con el ancho del ALA como superficie de apoyo: k = ks · bf · L_tributaria.
    X = rejilla(p.nx, sx); Y = rejilla(p.ny, sy);
    for (const y of Y) for (const x of X) columnas.push({ x, y, b: bcol, P });

  } else if (sub === CIM_ESQUINERA) {
    // Excéntrica en las DOS direcciones: dos linderos que se cruzan, y dos vigas
    // centradoras, una por cada dirección.
    zapatas.push({ x0: 0, y0: 0, x1: B, y1: B, t: hz });
    columnas.push({ x: bcol / 2, y: bcol / 2, b: bcol, P });
    cuadrada(sx, bcol / 2, B); columnas.push({ x: sx, y: bcol / 2, b: bcol, P });
    cuadrada(bcol / 2, sy, B); columnas.push({ x: bcol / 2, y: sy, b: bcol, P });
    vigas.push([bcol / 2, bcol / 2, sx, bcol / 2], [bcol / 2, bcol / 2, bcol / 2, sy]);
  }

  // ── 2. el MODELO, igual para todas ───────────────────────────────────────
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
  const areaNudo = new Map<number, number>();

  const ponerPano = (a: number, b: number, c: number, d: number, t: number, area: number) => {
    const e = elements.length;
    elements.push([a, b, c, d]);
    elasticities.set(e, E); poissonsRatios.set(e, nu); shearModuli.set(e, Gc);
    densities.set(e, rho); thicknesses.set(e, t); plateFormulations.set(e, formul);
    for (const n of [a, b, c, d]) areaNudo.set(n, (areaNudo.get(n) ?? 0) + area / 4);
  };
  const ponerBarra = (a: number, b: number, bw: number, hh: number) => {
    if (a === b) return;
    const e = elements.length;
    elements.push([a, b]);
    elasticities.set(e, E); poissonsRatios.set(e, nu); shearModuli.set(e, Gc); densities.set(e, rho);
    areas.set(e, bw * hh);
    momentsOfInertiaY.set(e, (hh * bw ** 3) / 12);     // I22, plano 1-3
    momentsOfInertiaZ.set(e, (bw * hh ** 3) / 12);     // I33, el del canto
    const a1 = Math.max(bw, hh), b1 = Math.min(bw, hh);
    torsionalConstants.set(e, a1 * b1 ** 3 * (1 / 3 - 0.21 * (b1 / a1) * (1 - b1 ** 4 / (12 * a1 ** 4))));
  };

  // ── EMPARRILLADO EN T INVERTIDA: barras, no cáscaras ─────────────────────
  if (sub === CIM_VIGA_T) {
    const bf = Math.max(0.3, p.vtBf ?? 1.0);        // ancho del ala (apoyo)
    const tf = Math.max(0.15, p.vtTf ?? 0.30);      // canto del ala
    const bw = Math.max(0.15, p.vtBw ?? 0.30);      // ancho del alma
    const hT = Math.max(tf + 0.1, p.vtH ?? 0.80);   // canto total
    const S = seccionTInvertida(bf, tf, bw, hT);
    const ponerT = (a: number, b: number) => {
      if (a === b) return;
      const e = elements.length;
      elements.push([a, b]);
      elasticities.set(e, E); poissonsRatios.set(e, nu); shearModuli.set(e, Gc); densities.set(e, rho);
      areas.set(e, S.A); momentsOfInertiaY.set(e, S.I22); momentsOfInertiaZ.set(e, S.I33);
      torsionalConstants.set(e, S.J);
    };
    // la superficie de apoyo de cada nudo: medio tramo a cada lado x el ancho del ala
    const apoyo = (n: number, L: number) => areaNudo.set(n, (areaNudo.get(n) ?? 0) + (bf * L) / 2);
    const eje = (fijo: number, v: number[], enX: boolean) => {
      const q = partir(v, ms);
      for (let i = 0; i < q.length - 1; i++) {
        const a = enX ? nudo(q[i], fijo, 0) : nudo(fijo, q[i], 0);
        const b = enX ? nudo(q[i + 1], fijo, 0) : nudo(fijo, q[i + 1], 0);
        const L = q[i + 1] - q[i];
        ponerT(a, b); apoyo(a, L); apoyo(b, L);
      }
    };
    for (const y of Y) eje(y, X, true);
    for (const x of X) eje(x, Y, false);
    (states as any).__seccionT = S;
    console.info(`[Cimentación] T invertida ${bf}x${tf} + alma ${bw}x${(hT - tf).toFixed(2)}: ` +
      `A = ${S.A.toFixed(4)} m², I33 = ${S.I33.toExponential(4)}, eje neutro a ${S.yc.toFixed(3)} m de la base.`);
  }

  // cada zapata se malla con los cortes de las columnas que caen dentro
  for (const z of zapatas) {
    const dentro = columnas.filter((c) => c.x >= z.x0 - 1e-6 && c.x <= z.x1 + 1e-6 &&
                                          c.y >= z.y0 - 1e-6 && c.y <= z.y1 + 1e-6);
    const cortesX = dentro.flatMap((c) => [c.x - c.b / 2, c.x + c.b / 2]);
    const cortesY = dentro.flatMap((c) => [c.y - c.b / 2, c.y + c.b / 2]);
    const limpia = (v: number[]) => v.sort((a, b) => a - b).filter((q, i, w) => i === 0 || q - w[i - 1] > 1e-6);
    const xs = conCortes(partir(limpia([z.x0, ...dentro.map((c) => c.x), z.x1]), ms), cortesX);
    const ys = conCortes(partir(limpia([z.y0, ...dentro.map((c) => c.y), z.y1]), ms), cortesY);
    const id: number[][] = ys.map((y) => xs.map((x) => nudo(x, y, 0)));
    for (let j = 0; j < ys.length - 1; j++)
      for (let i = 0; i < xs.length - 1; i++)
        ponerPano(id[j][i], id[j][i + 1], id[j + 1][i + 1], id[j + 1][i], z.t,
                  (xs[i + 1] - xs[i]) * (ys[j + 1] - ys[j]));
  }

  // vigas de amarre / centradoras, a la cota del cimiento
  for (const [x0, y0, x1, y1] of vigas) ponerBarra(nudo(x0, y0, 0), nudo(x1, y1, 0), bva, hva);

  // ── 3. la carga entra por la HUELLA de cada columna, no por un nudo ──────
  let sinMalla = 0;
  for (const c of columnas) {
    const dentro: number[] = [];
    for (let i = 0; i < nodes.length; i++) {
      if (Math.abs(nodes[i][2]) > 1e-9) continue;
      if (Math.abs(nodes[i][0] - c.x) <= c.b / 2 + 1e-9 &&
          Math.abs(nodes[i][1] - c.y) <= c.b / 2 + 1e-9) dentro.push(i);
    }
    const n0 = nudo(c.x, c.y, 0);
    if (dentro.length === 0) { dentro.push(n0); sinMalla++; }
    let At = 0;
    for (const i of dentro) At += areaNudo.get(i) ?? 0;
    for (const i of dentro) {
      const w = At > 0 ? (areaNudo.get(i) ?? 0) / At : 1 / dentro.length;
      const q = loads.get(i) ?? [0, 0, 0, 0, 0, 0];
      loads.set(i, [q[0], q[1], q[2] - c.P * w, q[3], q[4], q[5]]);
    }
    ponerBarra(n0, nudo(c.x, c.y, hped), c.b, c.b);     // pedestal, solo para verlo
  }
  if (sinMalla) console.warn(`[Cimentación] ${sinMalla} columna(s) con la malla más gruesa que su huella: ` +
    `baja el tamaño de malla por debajo de ${bcol} m si vas a mirar punzonamiento.`);

  // ── 4. el terreno: muelles de Winkler ────────────────────────────────────
  const springs: Array<{ node: number; dof: number; k: number }> = [];
  for (const [n, A] of areaNudo) {
    springs.push({ node: n, dof: 2, k: ks * A });
    springs.push({ node: n, dof: 0, k: (ks / 2) * A });
    springs.push({ node: n, dof: 1, k: (ks / 2) * A });
  }
  const primero = nudo(columnas[0].x, columnas[0].y, 0);
  const kRot = ks * 1e-4;                       // quita el último sólido rígido (giro Z)
  for (const d of [3, 4, 5]) springs.push({ node: primero, dof: d, k: kRot });

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
    const def = states.deformOutputs.val?.deformations;
    if (def) {
      // La PRESIÓN del terreno, q = ks·w, que es lo que se mira en un cimiento.
      const pres = new Map<number, number[]>();
      for (let e = 0; e < elements.length; e++) {
        const el = elements[e];
        if (el.length !== 4) continue;
        pres.set(e, el.map((n: number) => {
          const w = def.get ? def.get(n)?.[2] : def[n]?.[2];
          return ks * (w ?? 0);                  // negativo = el suelo comprimido
        }));
      }
      (states.analyzeOutputs.val as any).pressure = pres;

      // ⚠️ EL MUELLE ES LINEAL: puede TIRAR hacia abajo de una esquina que se levanta.
      // El suelo no hace eso. SAFE tiene «Compression Only» (no lineal) justo para
      // esto. Se cuenta y se avisa: en una de lindero o esquinera, si hay muchos
      // nudos levantados, el reparto de presiones de ese caso no vale.
      let arriba = 0, total = 0;
      for (const [n] of areaNudo) {
        const w = def.get ? def.get(n)?.[2] : def[n]?.[2];
        if (w == null) continue;
        total++;
        if (w > 1e-9) arriba++;
      }
      (states as any).__cimNudosLevantados = { arriba, total };
      if (arriba > 0) console.warn(`[Cimentación] ${arriba} de ${total} nudos LEVANTADOS ` +
        `(${((100 * arriba) / total).toFixed(1)} %): ahí el muelle está traccionando, que es lo ` +
        `que SAFE evita con «Compression Only». Agranda la zapata o la viga centradora.`);
    }
  } catch (err) {
    console.error("[Cimentación] el solver no cerró:", err);
  }
}
