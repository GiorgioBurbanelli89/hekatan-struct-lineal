/**
 * Los cuatro tests del paper ITW 1990 — Ibrahimbegovic, Taylor & Wilson,
 * "A robust quadrilateral membrane finite element with drilling degrees of
 * freedom", Int. J. Numer. Methods Eng. 30, 445-457.
 *
 * Son LOS tests del drilling: cada uno mide una cosa distinta del giro normal.
 *
 *   I   patch test de orden superior — viga a flexion pura. Con malla regular la
 *       respuesta es EXACTA (flecha 1.5, giro 0.6). Si no sale exacta, el
 *       elemento esta mal; no es cuestion de refinar.
 *   II  cantilever corto — dominado por cortante, es donde el drilling se nota.
 *       Exacto de elasticidad (Timoshenko-Goodier) = 0.3553.
 *   III Cook — trapecio, ademas mide la distorsion de malla. Referencia 23.91
 *       en el punto C = (48,52), el CENTRO del borde cargado (no la esquina).
 *   IV  hemisferio con agujero de 18 grados — MacNeal-Harder. Referencia 0.094.
 *
 * Todo en el plano X-Z (como los muros del ejemplo drilling-dof), con Uy, Rx y
 * Rz sujetos en TODOS los nudos: asi queda membrana pura y el unico giro vivo es
 * Ry, que es el drilling. El hemisferio no: ese es cascara de verdad.
 *
 * Categoria: "test"
 */
import { deform, analyze, type Node, type Element } from "hekatan-fem";
import type { ExampleDef } from "../workspace/exampleRegistry";

type Sup = [boolean, boolean, boolean, boolean, boolean, boolean];
type Car = [number, number, number, number, number, number];

/** Malla nx x ny sobre un cuadrilatero de 4 esquinas (x,z), por mapeo bilineal. */
function mallaQuad(
  esq: [number, number][], nx: number, ny: number,
  nodes: Node[], elements: Element[],
) {
  const [[x1, z1], [x2, z2], [x3, z3], [x4, z4]] = esq;
  const idx: number[][] = [];
  for (let j = 0; j <= ny; j++) {
    const fila: number[] = [];
    for (let i = 0; i <= nx; i++) {
      const r = i / nx, s = j / ny;
      const N = [(1 - r) * (1 - s), r * (1 - s), r * s, (1 - r) * s];
      const x = N[0] * x1 + N[1] * x2 + N[2] * x3 + N[3] * x4;
      const z = N[0] * z1 + N[1] * z2 + N[2] * z3 + N[3] * z4;
      fila.push(nodes.push([x, 0, z]) - 1);
    }
    idx.push(fila);
  }
  for (let j = 0; j < ny; j++)
    for (let i = 0; i < nx; i++)
      elements.push([idx[j][i], idx[j][i + 1], idx[j + 1][i + 1], idx[j + 1][i]]);
  return idx;
}

/**
 * Membrana pura en X-Z. Antes (hasta el 27-sep-2026) fijaba a mano Uy, Rx, Rz en
 * TODOS los nudos «para forzar el plano». Jorge, viendo el vídeo del test I:
 * «los nodos son unos triángulos, esos no son nudos, arréglalo» — con esa marca
 * cada uno de los 14 nudos salía dibujado como apoyo (triángulo azul), tapando
 * los DOS apoyos reales del Fig.3 (nudo inferior izquierdo y derecho) entre un
 * bosque de marcadores iguales.
 *
 * Medido antes de tocarlo (`getZerosIndices` de deform.cpp, ver CLAUDE.md): un
 * elemento membrana no aporta NINGUNA rigidez a Uy/Rx/Rz en ningún nudo — esas
 * tres columnas de K son cero en TODA la estructura, así que el propio solver ya
 * las saca del sistema y las deja en 0, sin que haga falta restringirlas a mano.
 * Comparado nudo a nudo (patch test I): flecha y giro salen IDÉNTICOS a 14
 * decimales con y sin esta función — es redundante para el cálculo y solo
 * ensuciaba el dibujo. Los `fijar()` de cada test (los apoyos REALES del papel)
 * siguen intactos: ahora son los ÚNICOS que se ven.
 */
function membranaPura(_nNodos: number): Map<number, Sup> {
  return new Map();
}
function fijar(sup: Map<number, Sup>, id: number, gdl: number[]) {
  const a = (sup.get(id) || [false, false, false, false, false, false]).slice() as Sup;
  for (const k of gdl) a[k] = true;
  sup.set(id, a);
}

/**
 * `formulacion` va con los MISMOS numeros de la OAPI de CSI: 0 = Shell-Thick,
 * 1 = Shell-Thin, 2 = Membrana. No es cosmetico: los exportadores .e2k y .s2k
 * lo escriben tal cual (`MODELINGTYPE "Membrane"` / `Type=Membrane`), y sin eso
 * el mismo modelo daba 1.500000 montado por la OAPI y 1.491651 al pasar por el
 * fichero — o sea que se comparaban dos elementos, no dos caminos.
 */
function inputsMembrana(nElem: number, t: number, E: number, nu: number,
                        formulacion = 2) {
  const thicknesses = new Map<number, number>();
  const elasticities = new Map<number, number>();
  const poissonsRatios = new Map<number, number>();
  const densities = new Map<number, number>();
  const plateFormulations = new Map<number, number>();
  for (let e = 0; e < nElem; e++) {
    thicknesses.set(e, t); elasticities.set(e, E);
    poissonsRatios.set(e, nu); densities.set(e, 0);
    plateFormulations.set(e, formulacion);
  }
  return { thicknesses, elasticities, poissonsRatios, densities, plateFormulations };
}

const RES = {
  defaultShellResult: "membraneXX" as const,
  availableShellResults: [
    "none", "pressure",
    "membraneXX", "membraneYY", "membraneXY",
    "membranePrincipalMax", "membranePrincipalMin", "vonMises",
    "tranverseShearX", "tranverseShearY", "transverseShearMax",
    "bendingXX", "bendingYY", "bendingXY",
    "bendingPrincipalMax", "bendingPrincipalMin",
    "displacementX", "displacementY", "displacementZ",
  ],
};

// ─────────────────────────────────────────────────────────────────────────────
// TEST I — patch test de orden superior (Figura 3 / Tabla I)
// l=10, h=1, E=100, nu=0, t=1, 6 elementos. Momento unidad en cada extremo
// aplicado como PAR DE FUERZAS P=1 arriba y abajo.
// Exacto: flecha en el centro = 1.5, giro en el extremo = 0.6.
// ─────────────────────────────────────────────────────────────────────────────
export const itwPatchTest: ExampleDef = {
  id: "itw-patch-test",
  name: "ITW I — patch test de orden superior (viga a flexión pura)",
  category: "2️⃣ Shells · 🕸 Membranas",
  benchmark: true,
  ...RES,
  params: {
    L:  { default: 10, min: 4, max: 20, step: 1, label: "l luz (m)" },
    H:  { default: 1, min: 0.5, max: 3, step: 0.25, label: "h canto (m)" },
    t:  { default: 1, min: 0.2, max: 2, step: 0.1, label: "t espesor (m)" },
    E:  { default: 100, min: 10, max: 1e6, step: 10, label: "E (kN/m²)" },
    nu: { default: 0, min: 0, max: 0.45, step: 0.05, label: "ν" },
    P:  { default: 1, min: 0.1, max: 10, step: 0.1, label: "P del par (kN)" },
    nx: { default: 6, min: 2, max: 24, step: 1, label: "nx elementos" },
  },
  build(p, states) {
    const nx = Math.round(p.nx);
    const nodes: Node[] = [], elements: Element[] = [];
    const g = mallaQuad([[0, 0], [p.L, 0], [p.L, p.H], [0, p.H]], nx, 1, nodes, elements);

    // apoyos MINIMOS (Fig.3): nudo inferior izquierdo Ux+Uz, inferior derecho Uz
    const supports = membranaPura(nodes.length);
    fijar(supports, g[0][0], [0, 2]);
    fijar(supports, g[0][nx], [2]);

    // par de fuerzas P: momento unidad en cada extremo
    const loads = new Map<number, Car>();
    const pon = (id: number, fx: number) => {
      const c = (loads.get(id) || [0, 0, 0, 0, 0, 0]).slice() as Car;
      c[0] += fx; loads.set(id, c);
    };
    pon(g[1][0], +p.P); pon(g[0][0], -p.P);
    pon(g[1][nx], -p.P); pon(g[0][nx], +p.P);

    states.nodes.val = nodes;
    states.elements.val = elements;
    states.nodeInputs.val = { supports, loads };
    states.elementInputs.val = inputsMembrana(elements.length, p.t, p.E, p.nu);
    try {
      states.deformOutputs.val = deform(nodes, elements, { supports, loads }, states.elementInputs.val);
      states.analyzeOutputs.val = analyze(nodes, elements, states.elementInputs.val, states.deformOutputs.val);
      const d = states.deformOutputs.val.deformations;
      const mitad = Math.round(nx / 2);
      const flecha = 0.5 * ((d?.get(g[0][mitad])?.[2] ?? 0) + (d?.get(g[1][mitad])?.[2] ?? 0));
      const giro = 0.5 * ((d?.get(g[0][nx])?.[4] ?? 0) + (d?.get(g[1][nx])?.[4] ?? 0));
      console.log(`[ITW I] flecha centro = ${flecha.toFixed(6)} (exacto ±1.5)  ·  giro extremo = ${giro.toFixed(6)} (exacto ±0.6)`);
    } catch (e) { console.error("itw-patch-test:", e); }
    states.objects3D.val = [];
  },
};

// ─────────────────────────────────────────────────────────────────────────────
// TEST II — cantilever corto (Figura 4 / Tabla II)
// l=48, h=12, E=30000, nu=0.25, P=40, t=1. Exacto 0.3553.
// ─────────────────────────────────────────────────────────────────────────────
export const itwCantilever: ExampleDef = {
  id: "itw-cantilever",
  name: "ITW II — cantilever corto (dominado por cortante)",
  category: "2️⃣ Shells · 🕸 Membranas",
  benchmark: true,
  ...RES,
  params: {
    L:  { default: 48, min: 12, max: 96, step: 4, label: "l (m)" },
    H:  { default: 12, min: 4, max: 24, step: 2, label: "h (m)" },
    t:  { default: 1, min: 0.2, max: 2, step: 0.1, label: "t espesor (m)" },
    E:  { default: 30000, min: 1000, max: 1e6, step: 1000, label: "E (kN/m²)" },
    nu: { default: 0.25, min: 0, max: 0.45, step: 0.05, label: "ν" },
    P:  { default: 40, min: 5, max: 200, step: 5, label: "P cortante en punta (kN)" },
    nx: { default: 16, min: 1, max: 32, step: 1, label: "nx" },
    ny: { default: 4, min: 1, max: 16, step: 1, label: "ny" },
  },
  build(p, states) {
    const nx = Math.round(p.nx), ny = Math.round(p.ny);
    const nodes: Node[] = [], elements: Element[] = [];
    const g = mallaQuad([[0, 0], [p.L, 0], [p.L, p.H], [0, p.H]], nx, ny, nodes, elements);

    const supports = membranaPura(nodes.length);
    // empotramiento: Ux, Uz y TAMBIEN el drilling Ry en el borde x=0
    for (let j = 0; j <= ny; j++) fijar(supports, g[j][0], [0, 2, 4]);

    // cortante UNIFORME en el borde libre, repartido trapezoidal (igual que el
    // .cpd de Jorge: mitad de peso en los dos nudos de los extremos)
    const loads = new Map<number, Car>();
    const zs: number[] = [];
    for (let j = 0; j <= ny; j++) zs.push(nodes[g[j][nx]][2]);
    const peso = new Array(ny + 1).fill(0);
    for (let j = 0; j < ny; j++) {
      const dz = zs[j + 1] - zs[j];
      peso[j] += dz / 2; peso[j + 1] += dz / 2;
    }
    const s = peso.reduce((a, b) => a + b, 0);
    for (let j = 0; j <= ny; j++) {
      const c: Car = [0, 0, 0, 0, 0, 0]; c[2] = p.P * peso[j] / s;
      loads.set(g[j][nx], c);
    }

    states.nodes.val = nodes;
    states.elements.val = elements;
    states.nodeInputs.val = { supports, loads };
    states.elementInputs.val = inputsMembrana(elements.length, p.t, p.E, p.nu);
    try {
      states.deformOutputs.val = deform(nodes, elements, { supports, loads }, states.elementInputs.val);
      states.analyzeOutputs.val = analyze(nodes, elements, states.elementInputs.val, states.deformOutputs.val);
      const d = states.deformOutputs.val.deformations;
      const uz = 0.5 * ((d?.get(g[0][nx])?.[2] ?? 0) + (d?.get(g[ny][nx])?.[2] ?? 0));
      console.log(`[ITW II] flecha punta = ${uz.toFixed(6)} (exacto 0.3553, paper 16x4 = 0.3543)`);
    } catch (e) { console.error("itw-cantilever:", e); }
    states.objects3D.val = [];
  },
};

// ─────────────────────────────────────────────────────────────────────────────
// TEST III — membrana de Cook (Figura 5 / Tabla III)
// Trapecio (0,0)-(48,44)-(48,60)-(0,44), E=1, nu=1/3, t=1, cortante total P=1.
// Referencia refinada 23.91 en C = (48,52), el CENTRO del borde cargado.
// ─────────────────────────────────────────────────────────────────────────────
export const itwCook: ExampleDef = {
  id: "itw-cook",
  name: "ITW III — membrana de Cook (malla distorsionada)",
  category: "2️⃣ Shells · 🕸 Membranas",
  benchmark: true,
  ...RES,
  params: {
    t:  { default: 1, min: 0.2, max: 2, step: 0.1, label: "t espesor (m)" },
    E:  { default: 1, min: 0.1, max: 1000, step: 0.1, label: "E (kN/m²)" },
    nu: { default: 1 / 3, min: 0, max: 0.45, step: 0.01, label: "ν" },
    P:  { default: 1, min: 0.1, max: 10, step: 0.1, label: "P cortante total (kN)" },
    n:  { default: 8, min: 1, max: 16, step: 1, label: "n (malla n×n)" },
  },
  build(p, states) {
    const n = Math.round(p.n);
    const nodes: Node[] = [], elements: Element[] = [];
    const g = mallaQuad([[0, 0], [48, 44], [48, 60], [0, 44]], n, n, nodes, elements);

    const supports = membranaPura(nodes.length);
    // el .cpd empotra tambien el drilling (theta_y) en el borde x = 0
    for (let j = 0; j <= n; j++) fijar(supports, g[j][0], [0, 2, 4]);

    const loads = new Map<number, Car>();
    const zs: number[] = [];
    for (let j = 0; j <= n; j++) zs.push(nodes[g[j][n]][2]);
    const peso = new Array(n + 1).fill(0);
    for (let j = 0; j < n; j++) {
      const d = zs[j + 1] - zs[j]; peso[j] += d / 2; peso[j + 1] += d / 2;
    }
    const s = peso.reduce((a, b) => a + b, 0);
    for (let j = 0; j <= n; j++) {
      const c: Car = [0, 0, 0, 0, 0, 0]; c[2] = p.P * peso[j] / s;
      loads.set(g[j][n], c);
    }

    states.nodes.val = nodes;
    states.elements.val = elements;
    states.nodeInputs.val = { supports, loads };
    states.elementInputs.val = inputsMembrana(elements.length, p.t, p.E, p.nu);
    try {
      states.deformOutputs.val = deform(nodes, elements, { supports, loads }, states.elementInputs.val);
      states.analyzeOutputs.val = analyze(nodes, elements, states.elementInputs.val, states.deformOutputs.val);
      const d = states.deformOutputs.val.deformations;
      const c = n % 2 === 0
        ? (d?.get(g[n / 2][n])?.[2] ?? 0)
        : 0.5 * ((d?.get(g[0][n])?.[2] ?? 0) + (d?.get(g[n][n])?.[2] ?? 0));
      console.log(`[ITW III] flecha en C(48,52) = ${c.toFixed(4)} (referencia 23.91)`);
    } catch (e) { console.error("itw-cook:", e); }
    states.objects3D.val = [];
  },
};

// ─────────────────────────────────────────────────────────────────────────────
// TEST IV — hemisferio con agujero de 18 grados (Figura 6 / Tabla IV)
// R=10, t=0.04, E=68.25e6, nu=0.3, P=1. Un CUARTO por simetria.
// Referencia MacNeal-Harder 0.094 (Simo sugiere 0.093); paper 8x8 -> 0.0937.
// Este SI es cascara: membrana + flexion, geometria 3D.
// ─────────────────────────────────────────────────────────────────────────────
export const itwHemisferio: ExampleDef = {
  id: "itw-hemisferio",
  name: "ITW IV — hemisferio pinzado con agujero 18°",
  category: "2️⃣ Shells · 🐚 Cáscaras",
  benchmark: true,
  // 27-sep-2026 (Jorge: «¿por qué no se ven todos los resultados de cáscara para
  // escoger el que es?»): tenía la lista recortada a 4. Los otros tres ITW ya usan
  // ...RES (los 19 campos); este era el único distinto sin ninguna razón anotada.
  // ...RES primero: pisa su propio `defaultShellResult` (membraneXX) con el de abajo.
  ...RES,
  defaultShellResult: "vonMises",
  params: {
    R:   { default: 10, min: 5, max: 20, step: 1, label: "R radio (m)" },
    t:   { default: 0.04, min: 0.01, max: 0.2, step: 0.01, label: "t espesor (m)" },
    E:   { default: 68.25e6, min: 1e6, max: 2e8, step: 1e6, label: "E (kN/m²)" },
    nu:  { default: 0.3, min: 0, max: 0.45, step: 0.05, label: "ν" },
    P:   { default: 1, min: 0.1, max: 10, step: 0.1, label: "P pinzamiento (kN)" },
    phi: { default: 18, min: 0, max: 40, step: 1, label: "agujero φ (°)" },
    n:   { default: 8, min: 2, max: 16, step: 1, label: "n (malla n×n)" },
  },
  build(p, states) {
    const n = Math.round(p.n), R = p.R, d2r = Math.PI / 180;
    const th0 = p.phi * d2r, th1 = Math.PI / 2;          // colatitud desde el polo
    const nodes: Node[] = [], elements: Element[] = [];
    const idx: number[][] = [];
    for (let j = 0; j <= n; j++) {          // j: colatitud (agujero -> ecuador)
      const fila: number[] = [];
      const th = th0 + (th1 - th0) * j / n;
      for (let i = 0; i <= n; i++) {        // i: longitud 0 -> 90 grados (un cuarto)
        const ph = (Math.PI / 2) * i / n;
        fila.push(nodes.push([
          R * Math.sin(th) * Math.cos(ph),
          R * Math.sin(th) * Math.sin(ph),
          R * Math.cos(th),
        ]) - 1);
      }
      idx.push(fila);
    }
    for (let j = 0; j < n; j++)
      for (let i = 0; i < n; i++)
        elements.push([idx[j][i], idx[j][i + 1], idx[j + 1][i + 1], idx[j + 1][i]]);

    const supports = new Map<number, Sup>();
    // simetria en el plano X-Z (y=0, i=0): Uy, Rx, Rz sujetos
    for (let j = 0; j <= n; j++) fijar(supports, idx[j][0], [1, 3, 5]);
    // simetria en el plano Y-Z (x=0, i=n): Ux, Ry, Rz sujetos
    for (let j = 0; j <= n; j++) fijar(supports, idx[j][n], [0, 4, 5]);
    // un punto del ecuador sujeto en Z para quitar el solido rigido vertical
    fijar(supports, idx[n][0], [2]);

    const loads = new Map<number, Car>();
    loads.set(idx[n][0], [p.P, 0, 0, 0, 0, 0]);        // +X en el ecuador, y=0
    loads.set(idx[n][n], [0, -p.P, 0, 0, 0, 0]);       // -Y en el ecuador, x=0

    states.nodes.val = nodes;
    states.elements.val = elements;
    states.nodeInputs.val = { supports, loads };
    // El hemisferio SI es cascara: membrana + flexion. Va con Shell-THICK
    // (formulacion 0), no Thin, aunque el paper use DKQ: medido, nuestra
    // flexion DKE da -44.14 % aqui y el MITC4 -37.40 %. Es un dato sobre
    // NUESTRA placa, no sobre el elemento del paper.
    states.elementInputs.val = inputsMembrana(elements.length, p.t, p.E, p.nu, 0);
    try {
      states.deformOutputs.val = deform(nodes, elements, { supports, loads }, states.elementInputs.val);
      states.analyzeOutputs.val = analyze(nodes, elements, states.elementInputs.val, states.deformOutputs.val);
      const d = states.deformOutputs.val.deformations;
      const ux = d?.get(idx[n][0])?.[0] ?? 0;
      console.log(`[ITW IV] desplazamiento bajo la carga = ${ux.toFixed(6)} (referencia 0.094)`);
    } catch (e) { console.error("itw-hemisferio:", e); }
    states.objects3D.val = [];
  },
};

// ─────────────────────────────────────────────────────────────────────────────
// §4.1 — PATCH TEST de un elemento sesgado, tracción uniforme (Figura 2)
//
// El único elemento del paper que faltaba. Fig. 2: cuadrilátero sesgado con el
// borde izquierdo vertical contra un muro, pin abajo y roller arriba (los
// apoyos MÍNIMOS que dibuja), y dos cargas P en +X en los dos nodos de la
// derecha. Eso tiene que producir un estado de tensión CONSTANTE:
//
//     Nx exacto = 2P / h   (equilibrio del patch),   Ny = Nxy = 0
//
// Si el elemento devuelve Nx ≈ 2P/h y Ny = Nxy ≈ 0 pasa el patch test; si no,
// el drilling o la interpolación andan mal. No depende de la malla: aquí no la
// hay, es UN elemento (por eso es el test más duro de la serie).
// ─────────────────────────────────────────────────────────────────────────────
export const itwPatch41: ExampleDef = {
  id: "itw-patch-41",
  name: "ITW 4.1 — Patch test de un elemento sesgado (Fig 2)",
  category: "2️⃣ Shells · 🕸 Membranas",
  benchmark: true,
  ...RES,
  params: {
    t:  { default: 1, min: 0.1, max: 2, step: 0.1, label: "t espesor (m)" },
    E:  { default: 100, min: 10, max: 1e6, step: 10, label: "E (kN/m²)" },
    nu: { default: 0.3, min: 0, max: 0.45, step: 0.05, label: "ν" },
    P:  { default: 1, min: 0.1, max: 10, step: 0.1, label: "P (kN)" },
    h:  { default: 2, min: 1, max: 6, step: 0.5, label: "h alto del borde" },
    a:  { default: 3, min: 1, max: 8, step: 0.5, label: "a arriba (sesgo)" },
    b:  { default: 4, min: 1, max: 8, step: 0.5, label: "b abajo (sesgo)" },
  },
  build(p, states) {
    // Plano X-Z (Y = normal), igual que el resto de los tests del paper.
    const nodes: Node[] = [
      [0, 0, 0],        // 0 · abajo izquierda (pin)
      [p.b, 0, 0],      // 1 · abajo derecha   (carga P)
      [p.a, 0, p.h],    // 2 · arriba derecha  (carga P)
      [0, 0, p.h],      // 3 · arriba izquierda (roller)
    ];
    const elements: Element[] = [[0, 1, 2, 3]];

    const supports = membranaPura(nodes.length);
    fijar(supports, 0, [0, 2]);    // pin: Ux y Uz
    fijar(supports, 3, [0]);       // roller contra el muro: solo Ux

    const loads = new Map<number, Car>();
    loads.set(1, [p.P, 0, 0, 0, 0, 0]);
    loads.set(2, [p.P, 0, 0, 0, 0, 0]);

    states.nodes.val = nodes;
    states.elements.val = elements;
    states.nodeInputs.val = { supports, loads };
    states.elementInputs.val = inputsMembrana(elements.length, p.t, p.E, p.nu);
    try {
      states.deformOutputs.val = deform(nodes, elements, { supports, loads }, states.elementInputs.val);
      states.analyzeOutputs.val = analyze(nodes, elements, states.elementInputs.val, states.deformOutputs.val);
      const m = states.analyzeOutputs.val;
      console.log(`[ITW 4.1] Nx = ${(m.membraneXXcentro?.get(0) ?? NaN).toFixed(6)} `
        + `Ny = ${(m.membraneYYcentro?.get(0) ?? NaN).toFixed(6)} `
        + `Nxy = ${(m.membraneXYcentro?.get(0) ?? NaN).toFixed(6)}  (exacto Nx = ${(2 * p.P / p.h).toFixed(6)})`);
    } catch (e) { console.error("itw-patch-41:", e); }
    states.objects3D.val = [];
  },
  computedLabels(p, states) {
    const m = states.analyzeOutputs.val;
    const nx = m?.membraneXXcentro?.get(0) ?? NaN;
    const ny = m?.membraneYYcentro?.get(0) ?? NaN;
    const nxy = m?.membraneXYcentro?.get(0) ?? NaN;
    const j = m?.membraneXXjoint?.get(0) ?? [];
    const exacto = 2 * p.P / p.h;                      // N/m = fuerza total 2P sobre h
    const err = (nx / exacto - 1) * 100;
    const rango = j.length ? Math.max(...j) - Math.min(...j) : NaN;
    return {
      "Nx calculado": nx.toExponential(5) + " N/m",
      "Nx exacto": exacto.toExponential(5) + " N/m",
      "error": err.toFixed(4) + " %",
      "Ny / Nxy": `${ny.toExponential(2)} / ${nxy.toExponential(2)}  (deben ser ≈ 0)`,
      "rango Nx (4 joints)": rango.toExponential(2) + " (constante ⇒ pasa)",
      "por qué": "patch test: un solo elemento sesgado, tiene que devolver tensión CONSTANTE",
    };
  },
};
