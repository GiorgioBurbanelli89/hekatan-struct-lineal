/**
 * cargaMovil — carga móvil por LÍNEAS DE INFLUENCIA (camión + carril), reutilizable.
 *
 * Sirve para cualquier modelo LINEAL con un camino de nudos por donde pasa el vehículo:
 * la alcantarilla cajón, un tablero de puente, una viga continua.
 *
 * ── Cómo se calcula (el porqué) ────────────────────────────────────────────────
 * El modelo es lineal, así que la respuesta a varias cargas es la SUMA de las respuestas a
 * cada una (superposición, como y = m·x: doble carga → doble flecha). Se resuelve UNA vez por
 * nudo del camino con una carga unitaria vertical (1 kN hacia abajo): eso da la línea de
 * influencia de TODO (desplazamientos, M, V, N en cada barra, reacciones de los muelles).
 * Después, el camión en cualquier posición es solo sumar:  R = Σ P_k · IL(x_k).
 * Es lo que hace SAP2000 en su Moving Load (CSI Analysis Reference Manual, cap. XXVI).
 *
 * ── Qué carga ──────────────────────────────────────────────────────────────────
 * HL-93K = camión de diseño + carga de carril. Fuente en la PC: CSI Analysis Reference Manual
 * (SAP2000 24, `Manuals/CSiRefer.pdf`), pág. 515 y Figura 92 (pág. 517): ejes 8 k · 32 k · 32 k,
 * separación 14 ft y 14–30 ft (la trasera varía), carril 0.640 k/ft, y el factor dinámico `im`
 * se aplica SOLO a los ejes, no al carril. En SI (AASHTO LRFD): 35 / 145 / 145 kN, 4.3 m y
 * 4.3–9.0 m, carril 9.3 kN/m.
 *
 * ── Límites (dichos, no escondidos) ────────────────────────────────────────────
 *  · Un eje entre dos nudos se reparte por la regla de la palanca. Es EXACTO solo si cae en
 *    nudo; `pesosEnPosicion` devuelve cuánto se ha tenido que repartir (`repartido`) para que
 *    el que llama lo vea. La alcantarilla se malla para que los ejes caigan siempre en nudo.
 *  · El carril va a la envolvente cargando solo los tramos de la línea de influencia que
 *    suman (carga «a trozos», como hace SAP con el HL-93K), con cargas nodales w·(ancho
 *    tributario). En la animación el carril no se dibuja: se ve el camión.
 *  · Solo modelos lineales. Muelles solo-compresión = no lineal = no vale la superposición.
 *
 * Unidades: kN y m.
 */
import { deform, analyze } from "hekatan-fem";

// ─────────────────────────────────────────────────────────────────────────────
// Vehículos
// ─────────────────────────────────────────────────────────────────────────────
export interface Eje {
  /** distancia DETRÁS del eje delantero (m), ≥ 0 */
  d: number;
  /** carga del eje (kN), ya dividida por el ancho de reparto y con el factor dinámico */
  P: number;
}

export interface Vehiculo {
  nombre: string;
  ejes: Eje[];
  /** carga de carril (kN/m, ya dividida por el ancho de reparto); 0 = sin carril */
  carril: number;
  /** de dónde salen los números */
  fuente: string;
}

export interface OpcionesHL93 {
  /** separación entre los dos ejes traseros (m): AASHTO la deja variar de 4.3 a 9.0 */
  sepTrasera?: number;
  /** factor dinámico IM en % (solo ejes). CSI p.515: «if im = 33 … multiplied by 1.33» */
  IM?: number;
  /** ancho de reparto (m): las cargas se dividen por él para dar kN por metro de franja */
  ancho?: number;
  /** incluir la carga de carril (HL-93K la incluye) */
  conCarril?: boolean;
}

/** Los números del HL-93 en SI (AASHTO LRFD), comprobados contra la Fig. 92 del manual CSI. */
export const HL93 = {
  ejes: [35, 145, 145] as const,        // kN   (8 k · 32 k · 32 k = 35.6 · 142.3 · 142.3 kN)
  sepDelantera: 4.3,                    // m    (14 ft = 4.267 m)
  sepTraseraMin: 4.3,                   // m    (14 ft)
  sepTraseraMax: 9.0,                   // m    (30 ft = 9.144 m)
  carril: 9.3,                          // kN/m (0.640 k/ft = 9.34 kN/m)
  fuente: "HL-93K (AASHTO LRFD, SI). En la PC: CSI Analysis Reference Manual, SAP2000 24, cap. XXVI, p. 515 y Fig. 92 p. 517",
};

export function camionHL93(o: OpcionesHL93 = {}): Vehiculo {
  const sep2 = o.sepTrasera ?? HL93.sepTraseraMin;
  const fIM = 1 + (o.IM ?? 0) / 100;
  const b = o.ancho && o.ancho > 0 ? o.ancho : 1;
  return {
    nombre: `HL-93 (35/145/145 kN · 4.3/${sep2.toFixed(2)} m${o.IM ? ` · IM ${o.IM} %` : ""}${b !== 1 ? ` · ÷${b} m` : ""})`,
    ejes: [
      { d: 0, P: HL93.ejes[0] * fIM / b },
      { d: HL93.sepDelantera, P: HL93.ejes[1] * fIM / b },
      { d: HL93.sepDelantera + sep2, P: HL93.ejes[2] * fIM / b },
    ],
    carril: (o.conCarril ?? true) ? HL93.carril / b : 0,
    fuente: HL93.fuente,
  };
}

export const largoVehiculo = (v: Vehiculo) => Math.max(0, ...v.ejes.map((e) => e.d));
export const pesoEjes = (v: Vehiculo) => v.ejes.reduce((s, e) => s + e.P, 0);

// ─────────────────────────────────────────────────────────────────────────────
// Modelo y camino
// ─────────────────────────────────────────────────────────────────────────────
export interface ModeloLineal {
  nodes: number[][];
  elements: number[][];
  nodeInputs: any;        // { supports: Map<nudo, bool[6]>, ... } — las cargas se ignoran
  elementInputs: any;
  springs?: Array<{ node: number; dof: number; k: number }>;
}

/** Nudos por donde pasa el vehículo, en orden, con su abscisa `s` (m) a lo largo del camino. */
export interface Camino {
  nudos: number[];
  s: number[];
}

/** Camino = los nudos que cumplen `filtro`, ordenados por la coordenada `eje` (0 = X). */
export function caminoPorCoordenada(nodes: number[][], filtro: (n: number[], i: number) => boolean, eje = 0): Camino {
  const idx = nodes.map((n, i) => (filtro(n, i) ? i : -1)).filter((i) => i >= 0);
  idx.sort((a, b) => nodes[a][eje] - nodes[b][eje]);
  const s0 = idx.length ? nodes[idx[0]][eje] : 0;
  return { nudos: idx, s: idx.map((i) => nodes[i][eje] - s0) };
}

/** Ancho tributario de cada nudo del camino (medio tramo a cada lado). */
export function tributario(c: Camino): number[] {
  const s = c.s;
  return s.map((_, i) => ((i > 0 ? s[i] - s[i - 1] : 0) + (i < s.length - 1 ? s[i + 1] - s[i] : 0)) / 2);
}

// ─────────────────────────────────────────────────────────────────────────────
// Líneas de influencia
// ─────────────────────────────────────────────────────────────────────────────
/** Por barra se guardan 6 números: [N_i, N_j, V_i, V_j, M_i, M_j] con el signo del DIAGRAMA de
 *  CSI (analyze() da fuerzas de extremo f = k·u; en el nudo i el diagrama es −f, en el j +f —
 *  ver hekatan-ui/src/viewer/objects/utils/diagramaCSI.ts). N = normals, V = shearsY (V2),
 *  M = bendingsZ (M3): el plano 1-2, el del pórtico plano. */
export const F_POR_BARRA = 6;

export interface LineasInfluencia {
  camino: Camino;
  nN: number;
  nE: number;
  /** U[k] = 6 GDL por nudo para 1 kN hacia abajo en el nudo k del camino */
  U: Float64Array[];
  /** F[k] = 6 valores por barra (ver F_POR_BARRA) */
  F: Float64Array[];
  /** R[k] = fuerza vertical de cada muelle (misma orden que `modelo.springs`), + hacia arriba */
  R: Float64Array[];
  /** reacciones de los apoyos: suma vertical por caso (para el equilibrio) */
  RzApoyos: Float64Array;
  /** tiempo total de las nCamino resoluciones (ms) */
  ms: number;
}

/**
 * Matriz «desplazamientos de la barra → fuerzas del diagrama» de cada barra (6 × 12), sacada
 * del PROPIO `analyze()` y no reescrita: `analyze` es lineal en los 12 GDL de la barra, así que
 * con desplazamientos unitarios se leen sus columnas. Para hacerlo en pocas llamadas se colorean
 * los nudos (dos nudos de una misma barra, colores distintos) y se mueve a la vez el GDL g de
 * todos los nudos de un color: 6 × (nº de colores) llamadas en vez de una por caso.
 * Motivo: `analyze` cuesta ~35 ms en este modelo y hay ~190 casos (6.6 s); así, ~0.6 s.
 */
function matricesDeFuerza(modelo: ModeloLineal): Float64Array[] {
  const nN = modelo.nodes.length;
  const color = new Int32Array(nN).fill(-1);
  const vecinos: number[][] = Array.from({ length: nN }, () => []);
  modelo.elements.forEach((el) => { if (el.length === 2) { vecinos[el[0]].push(el[1]); vecinos[el[1]].push(el[0]); } });
  let nCol = 0;
  for (let n = 0; n < nN; n++) {
    const usados = new Set(vecinos[n].map((v) => color[v]));
    let c = 0; while (usados.has(c)) c++;
    color[n] = c; nCol = Math.max(nCol, c + 1);
  }
  const B = modelo.elements.map(() => new Float64Array(F_POR_BARRA * 12));
  for (let c = 0; c < nCol; c++) for (let g = 0; g < 6; g++) {
    const deformations = new Map<number, number[]>();
    for (let n = 0; n < nN; n++) { const d = [0, 0, 0, 0, 0, 0]; if (color[n] === c) d[g] = 1; deformations.set(n, d); }
    const aout: any = analyze(modelo.nodes as any, modelo.elements as any, modelo.elementInputs, { deformations, reactions: new Map() } as any);
    modelo.elements.forEach((el, e) => {
      if (el.length !== 2) return;
      const col = color[el[0]] === c ? g : color[el[1]] === c ? 6 + g : -1;
      if (col < 0) return;
      const campos: Array<[any, number]> = [[aout?.normals, 0], [aout?.shearsY, 2], [aout?.bendingsZ, 4]];
      for (const [mapa, off] of campos) {
        const v = mapa?.get(e) ?? [0, 0];
        B[e][off * 12 + col] = -(v[0] ?? 0);          // diagrama en el nudo i = −f_i
        B[e][(off + 1) * 12 + col] = v[1] ?? 0;       // diagrama en el nudo j = +f_j
      }
    });
  }
  return B;
}

export interface OpcionesIL {
  /** llamado cada pocos casos con la fracción hecha (0–1); si devuelve una promesa, se espera
   *  (sirve para ceder el hilo al navegador y pintar una barra de progreso) */
  progreso?: (f: number) => void | Promise<void>;
}

export async function lineasDeInfluencia(modelo: ModeloLineal, camino: Camino, o: OpcionesIL = {}): Promise<LineasInfluencia> {
  const t0 = (globalThis.performance ?? Date).now();
  const nN = modelo.nodes.length, nE = modelo.elements.length;
  const U: Float64Array[] = [], F: Float64Array[] = [], R: Float64Array[] = [];
  const RzApoyos = new Float64Array(camino.nudos.length);
  const sp = modelo.springs ?? [];
  const B = matricesDeFuerza(modelo);
  for (let k = 0; k < camino.nudos.length; k++) {
    const nudo = camino.nudos[k];
    const loads = new Map<number, number[]>([[nudo, [0, 0, -1, 0, 0, 0]]]);
    const dout: any = deform(modelo.nodes as any, modelo.elements as any,
      { ...modelo.nodeInputs, loads } as any, modelo.elementInputs, sp.length ? sp : undefined);
    const u = new Float64Array(nN * 6);
    dout.deformations?.forEach((d: number[], n: number) => { for (let g = 0; g < 6; g++) u[n * 6 + g] = d[g] ?? 0; });
    U.push(u);
    let rz = 0;
    dout.reactions?.forEach((r: number[], n: number) => {
      const sup = modelo.nodeInputs.supports?.get(n);
      if (sup?.[2]) rz += r[2] ?? 0;
    });
    RzApoyos[k] = rz;
    const f = new Float64Array(nE * F_POR_BARRA);
    modelo.elements.forEach((el, e) => {
      if (el.length !== 2) return;
      const b = B[e], i6 = el[0] * 6, j6 = el[1] * 6;
      for (let r = 0; r < F_POR_BARRA; r++) {
        let s = 0;
        for (let g = 0; g < 6; g++) s += b[r * 12 + g] * u[i6 + g] + b[r * 12 + 6 + g] * u[j6 + g];
        f[e * F_POR_BARRA + r] = s;
      }
    });
    F.push(f);
    const r = new Float64Array(sp.length);
    sp.forEach((s, i) => { r[i] = -s.k * u[s.node * 6 + s.dof]; });
    R.push(r);
    if (o.progreso && (k % 16 === 15 || k === camino.nudos.length - 1)) await o.progreso((k + 1) / camino.nudos.length);
  }
  return { camino, nN, nE, U, F, R, RzApoyos, ms: (globalThis.performance ?? Date).now() - t0 };
}

/** Respuesta a unas cargas nodales fijas (el relleno, el peso propio…) con el mismo modelo, en el
 *  mismo formato que un caso de la línea de influencia. Se suma a cada posición. */
export function respuestaFija(modelo: ModeloLineal, loads: Map<number, number[]>): { U: Float64Array; F: Float64Array; R: Float64Array } {
  const nN = modelo.nodes.length, nE = modelo.elements.length, sp = modelo.springs ?? [];
  const dout: any = deform(modelo.nodes as any, modelo.elements as any, { ...modelo.nodeInputs, loads } as any,
    modelo.elementInputs, sp.length ? sp : undefined);
  const U = new Float64Array(nN * 6);
  dout.deformations?.forEach((d: number[], n: number) => { for (let g = 0; g < 6; g++) U[n * 6 + g] = d[g] ?? 0; });
  const aout: any = analyze(modelo.nodes as any, modelo.elements as any, modelo.elementInputs, dout);
  const F = new Float64Array(nE * F_POR_BARRA);
  const put = (mapa: Map<number, number[]> | undefined, off: number) =>
    mapa?.forEach((v, e) => { F[e * F_POR_BARRA + off] = -(v[0] ?? 0); F[e * F_POR_BARRA + off + 1] = v[1] ?? 0; });
  put(aout?.normals, 0); put(aout?.shearsY, 2); put(aout?.bendingsZ, 4);
  const R = new Float64Array(sp.length);
  sp.forEach((s, i) => { R[i] = -s.k * U[s.node * 6 + s.dof]; });
  return { U, F, R };
}

// ─────────────────────────────────────────────────────────────────────────────
// El vehículo en una posición
// ─────────────────────────────────────────────────────────────────────────────
export interface PesosPosicion {
  /** peso de cada caso unitario (kN): R = Σ w_k · IL_k */
  w: Float64Array;
  /** kN de ejes que están fuera del camino (antes de entrar o ya salidos) */
  fuera: number;
  /** kN repartidos por la regla de la palanca (ejes que NO caen en nudo). 0 = exacto */
  repartido: number;
  /** posición de cada eje (m, abscisa del camino) */
  xEjes: number[];
}

/** `xF` = abscisa del eje delantero. El vehículo avanza en +s; los ejes van detrás (s − d). */
export function pesosEnPosicion(c: Camino, v: Vehiculo, xF: number, tol = 1e-6): PesosPosicion {
  const w = new Float64Array(c.nudos.length);
  let fuera = 0, repartido = 0;
  const s = c.s, n = s.length, xEjes: number[] = [];
  for (const e of v.ejes) {
    const x = xF - e.d;
    xEjes.push(x);
    if (n === 0 || x < s[0] - tol || x > s[n - 1] + tol) { fuera += e.P; continue; }
    // búsqueda binaria del tramo [s_i, s_i+1] que contiene x
    let lo = 0, hi = n - 1;
    while (hi - lo > 1) { const m = (lo + hi) >> 1; if (s[m] <= x) lo = m; else hi = m; }
    if (Math.abs(x - s[lo]) <= tol) { w[lo] += e.P; continue; }
    if (Math.abs(x - s[hi]) <= tol) { w[hi] += e.P; continue; }
    const t = (x - s[lo]) / (s[hi] - s[lo]);
    w[lo] += e.P * (1 - t); w[hi] += e.P * t;
    repartido += e.P;
  }
  return { w, fuera, repartido, xEjes };
}

/** Abscisas del eje delantero: desde que entra el primero hasta que sale el último. */
export function posiciones(c: Camino, v: Vehiculo, paso: number): number[] {
  const L = c.s.length ? c.s[c.s.length - 1] : 0;
  const fin = L + largoVehiculo(v);
  const n = Math.max(1, Math.round(fin / paso));
  return Array.from({ length: n + 1 }, (_, i) => +(i * fin / n).toFixed(9));
}

export interface EstadoPosicion {
  xF: number;
  U: Float64Array;      // 6 GDL por nudo
  F: Float64Array;      // 6 por barra (F_POR_BARRA)
  R: Float64Array;      // fuerza de cada muelle
  sumaCargas: number;   // kN sobre la estructura (ejes dentro)
  sumaReacciones: number; // muelles + apoyos, vertical, + hacia arriba
  pesos: PesosPosicion;
}

function acumular(dst: Float64Array, src: Float64Array, a: number) {
  for (let i = 0; i < dst.length; i++) dst[i] += a * src[i];
}

export function estadoEnPosicion(IL: LineasInfluencia, v: Vehiculo, xF: number): EstadoPosicion {
  const p = pesosEnPosicion(IL.camino, v, xF);
  const U = new Float64Array(IL.nN * 6), F = new Float64Array(IL.nE * F_POR_BARRA), R = new Float64Array(IL.R[0]?.length ?? 0);
  let sumaCargas = 0, sumaReac = 0;
  p.w.forEach((wk, k) => {
    if (wk === 0) return;
    acumular(U, IL.U[k], wk); acumular(F, IL.F[k], wk); acumular(R, IL.R[k], wk);
    sumaCargas += wk;
    sumaReac += wk * IL.RzApoyos[k];
  });
  for (let i = 0; i < R.length; i++) sumaReac += R[i];
  return { xF, U, F, R, sumaCargas, sumaReacciones: sumaReac, pesos: p };
}

// ─────────────────────────────────────────────────────────────────────────────
// Envolventes
// ─────────────────────────────────────────────────────────────────────────────
export interface Envolvente {
  Umax: Float64Array; Umin: Float64Array;
  Fmax: Float64Array; Fmin: Float64Array;
  Rmax: Float64Array; Rmin: Float64Array;
  /** abscisa del eje delantero que da cada máximo / mínimo del camión (NaN si lo da solo el carril) */
  xFUmax: Float64Array; xFUmin: Float64Array; xFFmax: Float64Array; xFFmin: Float64Array;
  /** separaciones traseras probadas (m) */
  separaciones: number[];
  nPosiciones: number;
  ms: number;
}

export interface OpcionesEnvolvente {
  /** separaciones traseras a probar (HL-93: 4.3 … 9.0). Por defecto, solo la del vehículo */
  separacionesTraseras?: number[];
  /** construye el vehículo para una separación trasera dada (si se prueban varias) */
  vehiculoCon?: (sepTrasera: number) => Vehiculo;
  /** sumar el carril «a trozos» (solo donde la línea de influencia suma) */
  carril?: boolean;
}

/**
 * Máximo y mínimo de cada resultado para el camión en todas las `xs` (y todas las
 * separaciones traseras), MÁS el carril cargando solo la parte de la línea de influencia que
 * empeora ese resultado. Es la definición de envolvente de carga móvil de SAP2000 (HL-93K:
 * camión + carril a la vez).
 */
export function envolvente(IL: LineasInfluencia, v: Vehiculo, xs: number[], o: OpcionesEnvolvente = {}): Envolvente {
  const t0 = (globalThis.performance ?? Date).now();
  const nU = IL.nN * 6, nF = IL.nE * F_POR_BARRA, nR = IL.R[0]?.length ?? 0;
  const Umax = new Float64Array(nU).fill(-Infinity), Umin = new Float64Array(nU).fill(Infinity);
  const Fmax = new Float64Array(nF).fill(-Infinity), Fmin = new Float64Array(nF).fill(Infinity);
  const Rmax = new Float64Array(nR).fill(-Infinity), Rmin = new Float64Array(nR).fill(Infinity);
  const xFUmax = new Float64Array(nU).fill(NaN), xFUmin = new Float64Array(nU).fill(NaN);
  const xFFmax = new Float64Array(nF).fill(NaN), xFFmin = new Float64Array(nF).fill(NaN);
  const seps = o.separacionesTraseras?.length && o.vehiculoCon ? o.separacionesTraseras : [NaN];
  const U = new Float64Array(nU), F = new Float64Array(nF), R = new Float64Array(nR);
  let nPos = 0;
  for (const sep of seps) {
    const veh = Number.isFinite(sep) ? o.vehiculoCon!(sep) : v;
    for (const xF of xs) {
      const p = pesosEnPosicion(IL.camino, veh, xF);
      U.fill(0); F.fill(0); R.fill(0);
      p.w.forEach((wk, k) => { if (wk) { acumular(U, IL.U[k], wk); acumular(F, IL.F[k], wk); acumular(R, IL.R[k], wk); } });
      for (let i = 0; i < nU; i++) { if (U[i] > Umax[i]) { Umax[i] = U[i]; xFUmax[i] = xF; } if (U[i] < Umin[i]) { Umin[i] = U[i]; xFUmin[i] = xF; } }
      for (let i = 0; i < nF; i++) { if (F[i] > Fmax[i]) { Fmax[i] = F[i]; xFFmax[i] = xF; } if (F[i] < Fmin[i]) { Fmin[i] = F[i]; xFFmin[i] = xF; } }
      for (let i = 0; i < nR; i++) { if (R[i] > Rmax[i]) Rmax[i] = R[i]; if (R[i] < Rmin[i]) Rmin[i] = R[i]; }
      nPos++;
    }
  }
  // Sin posiciones dentro, el camión no aporta: la envolvente parte de 0.
  const cero = (a: Float64Array, s: number) => { for (let i = 0; i < a.length; i++) if (!Number.isFinite(a[i])) a[i] = 0; void s; };
  cero(Umax, 0); cero(Umin, 0); cero(Fmax, 0); cero(Fmin, 0); cero(Rmax, 0); cero(Rmin, 0);
  const wCarril = (o.carril ?? true) ? v.carril : 0;
  if (wCarril > 0) {
    const trib = tributario(IL.camino);
    IL.camino.nudos.forEach((_, k) => {
      const q = wCarril * trib[k];
      if (!q) return;
      const sumar = (IlK: Float64Array, mx: Float64Array, mn: Float64Array) => {
        for (let i = 0; i < IlK.length; i++) { const r = q * IlK[i]; if (r > 0) mx[i] += r; else mn[i] += r; }
      };
      sumar(IL.U[k], Umax, Umin); sumar(IL.F[k], Fmax, Fmin); sumar(IL.R[k], Rmax, Rmin);
    });
  }
  return {
    Umax, Umin, Fmax, Fmin, Rmax, Rmin, xFUmax, xFUmin, xFFmax, xFFmin,
    separaciones: seps.filter(Number.isFinite), nPosiciones: nPos,
    ms: (globalThis.performance ?? Date).now() - t0,
  };
}

/** Separaciones traseras del HL-93 de `min` a `max` cada `paso` (m). */
export function separacionesHL93(paso: number, min: number = HL93.sepTraseraMin, max: number = HL93.sepTraseraMax): number[] {
  const n = Math.max(0, Math.round((max - min) / paso));
  return Array.from({ length: n + 1 }, (_, i) => +(min + i * (max - min) / Math.max(1, n)).toFixed(9));
}

/** Casos estáticos por posición para exportar (SAP2000, OpenSees): cargas nodales por caso.
 *  Solo las posiciones con todos los ejes EN NUDO (las demás no se pueden escribir exactas). */
export function casosPorPosicion(c: Camino, v: Vehiculo, xs: number[]): Array<{ nombre: string; xF: number; cargas: Array<[number, number]> }> {
  const out: Array<{ nombre: string; xF: number; cargas: Array<[number, number]> }> = [];
  xs.forEach((xF, i) => {
    const p = pesosEnPosicion(c, v, xF);
    if (p.repartido > 1e-9) return;
    const cargas: Array<[number, number]> = [];
    p.w.forEach((wk, k) => { if (wk) cargas.push([c.nudos[k], wk]); });
    if (cargas.length) out.push({ nombre: `POS${String(i).padStart(3, "0")}`, xF, cargas });
  });
  return out;
}
