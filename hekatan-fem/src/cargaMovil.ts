/**
 * Carga de vehículos por un carril de barras — los dos Load Case de SAP2000 que la usan:
 *
 *  1) MULTI-STEP STATIC (CSiRefer cap. XVIII «Multi-Step Static Analysis», p. 348-349, y cap. XXVI
 *     «Step-By-Step Analysis», p. 535-537):
 *        K·u_i = r_i      un estático lineal independiente por paso
 *     · Patrón multipaso = «Vehicle Live»: en el paso i (t_i = i·Δt, i = 0 … dur/Δt) el eje delantero
 *       está en  estación + dir·v·(t_i − t0)  y los demás detrás a sus separaciones; solo CARGAS DE EJE
 *       (sin uniformes), separación variable = la mínima, el vehículo por el eje del carril.
 *     · Cada eje = carga concentrada sobre la barra del carril donde cae (no en el nudo).
 *     · Patrones de un solo paso (peso propio, SC…) se aplican en TODOS los pasos; los multipaso se
 *       sincronizan por número de paso; nº de pasos = el mayor.
 *
 *  2) MOVING LOAD por líneas de influencia (cap. XXVI p. 494-534): ver `cargaMovilEnvolvente`.
 *
 * Carga concentrada dentro de una barra: vector nodal consistente con las funciones de forma EXACTAS de la
 * viga de Timoshenko (las que dan la K de getLocalStiffnessMatrix: φ = 12EI/(G·As·L²)). Con ellas los
 * desplazamientos de los nudos son exactos y el empotramiento perfecto (−vector) va a
 * `elementInputs.frameFixedEnd` para que `analyze()` dé los esfuerzos de la barra cargada.
 *   ξ = a/L
 *   Nv1 = (1 + φ − φξ − 3ξ² + 2ξ³)/(1+φ)          Nθ1 = L·(ξ(1+φ/2) − ξ²(2+φ/2) + ξ³)/(1+φ)
 *   Nv2 = (φξ + 3ξ² − 2ξ³)/(1+φ)                  Nθ2 = L·(−ξφ/2 − ξ²(1−φ/2) + ξ³)/(1+φ)
 * Unidades: las del modelo (kN, m).
 */
import type { Node, Element, NodeInputs, ElementInputs } from "./data-model";
import { deformCpp as deform } from "./deformCpp";
import { analyze } from "./analyze";
import { getTransformationMatrix } from "./utils/getTransformationMatrix";

export type V6 = [number, number, number, number, number, number];

/** Vehículo general de CSI: n ejes; `sep[k]` = distancia del eje k al k+1 (la mínima si es variable). */
export interface VehiculoGeneral {
  nombre: string;
  ejes: number[];                 // kN
  sep: number[];                  // m (n − 1)
  /** separación variable: la `k` (índice en sep) va de sep[k] a dmax */
  variable?: { k: number; dmax: number };
  /** cargas uniformes [delantera, entre ejes (n−1)…, trasera] en kN/m (las extremas, infinitas) */
  unif?: number[];
}

/** Carril = barras en orden; la estación 0 está en el primer nudo del recorrido. */
export interface Carril {
  barras: number[];
}

interface Tramo { e: number; s0: number; L: number; inv: boolean; nI: number; nJ: number }

/** Tramos del carril con su estación de arranque y si la barra va al revés del recorrido. */
export function tramosCarril(nodes: Node[], elements: Element[], c: Carril): Tramo[] {
  const out: Tramo[] = [];
  let s = 0, prev = -1;
  c.barras.forEach((e, k) => {
    const [a, b] = elements[e];
    let inv = false;
    if (k === 0) {
      const sig = c.barras[1] !== undefined ? elements[c.barras[1]] : null;
      inv = !!sig && (a === sig[0] || a === sig[1]) && !(b === sig[0] || b === sig[1]);
    } else inv = b === prev;
    const L = Math.hypot(nodes[b][0] - nodes[a][0], nodes[b][1] - nodes[a][1], nodes[b][2] - nodes[a][2]);
    out.push({ e, s0: s, L, inv, nI: inv ? b : a, nJ: inv ? a : b });
    s += L; prev = inv ? a : b;
  });
  return out;
}

export const largoCarril = (t: Tramo[]) => (t.length ? t[t.length - 1].s0 + t[t.length - 1].L : 0);

/** Vector nodal consistente (12, GLOBALES) de una fuerza P·dir a la distancia `a` del nudo i de la barra e. */
export function cargaPuntualBarra(nodes: Node[], elements: Element[], ei: ElementInputs, e: number,
  a: number, P: number, dir: number[] = [0, 0, -1]): number[] {
  const [ni, nj] = elements[e];
  const pn = [nodes[ni], nodes[nj]] as Node[];
  const L = Math.hypot(pn[1][0] - pn[0][0], pn[1][1] - pn[0][1], pn[1][2] - pn[0][2]);
  const T = getTransformationMatrix(pn, ei?.localAngles?.get(e) ?? 0) as number[][];
  const loc = [0, 1, 2].map((r) => P * (T[r][0] * dir[0] + T[r][1] * dir[1] + T[r][2] * dir[2]));
  const E = ei?.elasticities?.get(e) ?? 0, G = ei?.shearModuli?.get(e) ?? 0, A = ei?.areas?.get(e) ?? 0;
  const Iz = ei?.momentsOfInertiaZ?.get(e) ?? 0, Iy = ei?.momentsOfInertiaY?.get(e) ?? 0;
  let AsY = ei?.shearAreasY?.get(e) ?? 0, AsZ = ei?.shearAreasZ?.get(e) ?? 0;
  if (AsY === 0 && AsZ === 0 && A > 0 && G > 0) AsY = AsZ = (5 / 6) * A;
  // igual que getLocalStiffnessMatrixFrame: plano 1-2 (Iz) con AsZ, plano 1-3 (Iy) con AsY
  const phiZ = AsZ > 0 && G > 0 ? (12 * E * Iz) / (G * AsZ * L * L) : 0;
  const phiY = AsY > 0 && G > 0 ? (12 * E * Iy) / (G * AsY * L * L) : 0;
  const x = Math.min(1, Math.max(0, a / L));
  const forma = (f: number) => [
    (1 + f - f * x - 3 * x * x + 2 * x ** 3) / (1 + f),
    (L * (x * (1 + f / 2) - x * x * (2 + f / 2) + x ** 3)) / (1 + f),
    (f * x + 3 * x * x - 2 * x ** 3) / (1 + f),
    (L * (-x * f / 2 - x * x * (1 - f / 2) + x ** 3)) / (1 + f),
  ];
  const fl = new Array(12).fill(0);
  fl[0] = loc[0] * (1 - x); fl[6] = loc[0] * x;               // axial: lineal
  const z = forma(phiZ);                                        // plano 1-2: v (y) y θz = +dv/dx
  fl[1] += loc[1] * z[0]; fl[5] += loc[1] * z[1]; fl[7] += loc[1] * z[2]; fl[11] += loc[1] * z[3];
  const y = forma(phiY);                                        // plano 1-3: w (z) y θy = −dw/dx
  fl[2] += loc[2] * y[0]; fl[4] -= loc[2] * y[1]; fl[8] += loc[2] * y[2]; fl[10] -= loc[2] * y[3];
  const g = new Array(12).fill(0);                              // global = Tᵀ·local
  for (let i = 0; i < 12; i++) { let s = 0; for (let k = 0; k < 12; k++) s += T[k][i] * fl[k]; g[i] = s; }
  return g;
}

/** Un paso de carga: cargas nodales + empotramiento perfecto de las barras cargadas. */
export interface PasoCarga { loads: Map<number, V6>; frameFixedEnd: Map<number, number[]> }

export const pasoVacio = (): PasoCarga => ({ loads: new Map(), frameFixedEnd: new Map() });

/** Suma al paso una fuerza P (dir) en la estación s del carril (nada si cae fuera). */
export function cargarEnCarril(paso: PasoCarga, nodes: Node[], elements: Element[], ei: ElementInputs,
  tr: Tramo[], s: number, P: number, dir: number[] = [0, 0, -1], tol = 1e-6, epsNudo = 0): number {
  const Lc = largoCarril(tr);
  if (!(P !== 0) || s < -tol || s > Lc + tol) return s;
  const suma = (n: number, v: number[], o: number) => {
    const p = paso.loads.get(n) ?? ([0, 0, 0, 0, 0, 0] as V6);
    for (let k = 0; k < 6; k++) p[k] += v[o + k];
    paso.loads.set(n, p);
  };
  // Un eje que cae JUSTO en un nudo del carril es carga de NUDO: no entra en el V2 de ninguna de las dos
  // barras (medido en SAP2000: ni el extremo j de la anterior ni el i de la siguiente lo llevan).
  // epsNudo > 0 = puntos de carga de las líneas de influencia de CSI (medido en SAP2000: estaciones de salida y V2):
  //   nudo interior → DENTRO de la barra anterior a (1 − ε)·L;  primer nudo → barra 1 en a = 0;  último → última en a = L
  //   (cargas de barra: entran en el V2 del extremo).
  let tFijo: Tramo | null = null;
  if (epsNudo > 0) {
    const q0 = tr[0], qn = tr[tr.length - 1];
    if (Math.abs(s - q0.s0) <= tol) { tFijo = q0; s = q0.s0; }
    else if (Math.abs(s - (qn.s0 + qn.L)) <= tol) { tFijo = qn; s = qn.s0 + qn.L; }
    else for (const q of tr) if (Math.abs(s - (q.s0 + q.L)) <= tol) {
      tFijo = q; s = q.s0 + (1 - epsNudo) * q.L; break; }
  } else for (const q of tr) for (const [sn, n] of [[q.s0, q.nI], [q.s0 + q.L, q.nJ]] as Array<[number, number]>)
    if (Math.abs(s - sn) <= tol) { suma(n, [P * dir[0], P * dir[1], P * dir[2], 0, 0, 0], 0); return s; }
  const t = tFijo ?? tr.find((q) => s > q.s0 && s < q.s0 + q.L) ?? tr[0];
  const sl = Math.min(t.L, Math.max(0, s - t.s0));
  const a = t.inv ? t.L - sl : sl;
  const eq = cargaPuntualBarra(nodes, elements, ei, t.e, a, P, dir);
  const [ni, nj] = elements[t.e];
  suma(ni, eq, 0); suma(nj, eq, 6);
  const fe = paso.frameFixedEnd.get(t.e) ?? new Array(12).fill(0);
  for (let k = 0; k < 12; k++) fe[k] -= eq[k];
  paso.frameFixedEnd.set(t.e, fe);
  return s;
}

/** Patrón «Vehicle Live» de CSI (un vehículo por un carril). */
export interface VehiculoVivo {
  vehiculo: VehiculoGeneral;
  carril: Carril;
  estacion?: number;      // m, eje delantero en t0
  t0?: number;            // s
  dir?: 1 | -1;           // Forward = +1, Backward = −1
  v: number;              // m/s
}

/** Pasos de un patrón Vehicle Live: dur/Δt + 1 pasos (t = 0, Δt, … dur). Solo ejes, separación mínima. */
export function pasosVehiculoVivo(nodes: Node[], elements: Element[], ei: ElementInputs,
  vivos: VehiculoVivo[], dur: number, dt: number, dirCarga: number[] = [0, 0, -1]): PasoCarga[] {
  const n = Math.round(dur / dt) + 1;
  const pasos: PasoCarga[] = [];
  const tramos = vivos.map((w) => tramosCarril(nodes, elements, w.carril));
  for (let i = 0; i < n; i++) {
    const t = i * dt, p = pasoVacio();
    vivos.forEach((w, k) => {
      if (t < (w.t0 ?? 0) - 1e-12) return;
      const d = w.dir ?? 1;
      const sFront = (w.estacion ?? 0) + d * w.v * (t - (w.t0 ?? 0));
      let off = 0;
      w.vehiculo.ejes.forEach((P, j) => {
        if (j > 0) off += w.vehiculo.sep[j - 1];
        cargarEnCarril(p, nodes, elements, ei, tramos[k], sFront - d * off, P, dirCarga);
      });
    });
    pasos.push(p);
  }
  return pasos;
}

/** Fuerzas de barra de un paso, como `analyze()`: [N, V2, V3, T, M2, M3] en los extremos i y j. */
export interface ResultadoPaso {
  deformations: Map<number, V6>;
  reactions: Map<number, V6>;
  normals: Map<number, [number, number]>;
  shearsY: Map<number, [number, number]>;
  shearsZ: Map<number, [number, number]>;
  torsions: Map<number, [number, number]>;
  bendingsY: Map<number, [number, number]>;
  bendingsZ: Map<number, [number, number]>;
}

/**
 * MULTI-STEP STATIC: un estático lineal por paso.
 *   patrones = [{ pasos: PasoCarga[] (1 = de un solo paso), sf }]; el paso i del caso suma el paso i de cada
 *   patrón multipaso y el único paso de cada patrón de un paso (CSiRefer p. 348).
 */
export function multiStepStatic(nodes: Node[], elements: Element[], nodeInputs: NodeInputs, elementInputs: ElementInputs,
  patrones: Array<{ pasos: PasoCarga[]; sf: number }>,
  springs?: Array<{ node: number; dof: number; k: number }>): ResultadoPaso[] {
  const nPasos = Math.max(1, ...patrones.map((p) => (p.pasos.length > 1 ? p.pasos.length : 1)));
  const fe0 = elementInputs.frameFixedEnd;
  const out: ResultadoPaso[] = [];
  for (let i = 0; i < nPasos; i++) {
    const loads = new Map<number, V6>(), fe = new Map<number, number[]>();
    if (fe0) for (const [e, v] of fe0) fe.set(e, [...v]);
    for (const pat of patrones) {
      const p = pat.pasos.length > 1 ? pat.pasos[i] : pat.pasos[0];
      if (!p) continue;
      for (const [n, v] of p.loads) {
        const q = loads.get(n) ?? ([0, 0, 0, 0, 0, 0] as V6);
        for (let k = 0; k < 6; k++) q[k] += pat.sf * v[k];
        loads.set(n, q);
      }
      for (const [e, v] of p.frameFixedEnd) {
        const q = fe.get(e) ?? new Array(12).fill(0);
        for (let k = 0; k < 12; k++) q[k] += pat.sf * v[k];
        fe.set(e, q);
      }
    }
    const ni = { ...nodeInputs, loads } as NodeInputs;
    const ei = { ...elementInputs, frameFixedEnd: fe } as ElementInputs;
    const d = deform(nodes, elements, ni, ei, springs) as any;
    const a = analyze(nodes, elements, ei, d) as any;
    out.push({ deformations: d.deformations, reactions: d.reactions, normals: a.normals, shearsY: a.shearsY,
      shearsZ: a.shearsZ, torsions: a.torsions, bendingsY: a.bendingsY, bendingsZ: a.bendingsZ });
  }
  return out;
}

/** Patrón de un solo paso a partir de cargas nodales (y empotramientos) ya armadas. */
export const pasoUnico = (loads?: Map<number, number[]>, frameFixedEnd?: Map<number, number[]>): PasoCarga[] => [{
  loads: new Map([...(loads ?? new Map())].map(([n, v]) => [n, [...v] as V6])),
  frameFixedEnd: new Map([...(frameFixedEnd ?? new Map())].map(([e, v]) => [e, [...v]])),
}];

// ═══════════════════════════════════════════════════════════════════════════════════════════════════════
// 2) MOVING LOAD por líneas de influencia (CSiRefer cap. XXVI, p. 494-534)
//   · Puntos de carga del carril: equiespaciados, el mayor paso ≤ discretización (p. 494).
//   · Línea de influencia de cada respuesta = respuesta a 1 (kN) hacia abajo en cada punto de carga; lineal entre puntos.
//   · Cada eje se pone en CADA punto de carga por turno (los demás interpolan); el vehículo va en los dos sentidos y
//     puede quedar parcialmente fuera del carril (p. 506, 534).
//   · Por defecto la carga va de 0 a su valor: en el máximo solo suman las contribuciones positivas y en el mínimo
//     solo las negativas (p. 506); las uniformes se integran sobre el tramo lineal a trozos (p. 534).
//   · Separación variable: se prueban dmin, dmax y las que ponen el eje siguiente en un punto de carga.
// ═══════════════════════════════════════════════════════════════════════════════════════════════════════
export interface EnvolventeMovil {
  /** por nudo: [max(6), min(6)] de desplazamientos */
  disp: Map<number, [number[], number[]]>;
  reac: Map<number, [number[], number[]]>;
  /** por barra y extremo (0 = i, 1 = j): [max(6), min(6)] en el DIAGRAMA de CSI [P, V2, V3, T, M2, M3] */
  barras: Map<number, Array<[number[], number[]]>>;
  puntos: number[];
}

/** ∫ max(0, η) (signo = +1) o ∫ min(0, η) (signo = −1) de la línea a trozos (s, η) entre a y b. */
function integralSigno(s: number[], eta: number[], a: number, b: number, signo: number): number {
  if (b <= a) return 0;
  let tot = 0;
  for (let k = 0; k < s.length - 1; k++) {
    const x0 = Math.max(a, s[k]), x1 = Math.min(b, s[k + 1]);
    if (x1 <= x0) continue;
    const f = (x: number) => eta[k] + (eta[k + 1] - eta[k]) * (x - s[k]) / (s[k + 1] - s[k]);
    let y0 = f(x0) * signo, y1 = f(x1) * signo;
    if (y0 >= 0 && y1 >= 0) tot += (y0 + y1) / 2 * (x1 - x0);
    else if (y0 > 0 || y1 > 0) { const xc = x0 + (x1 - x0) * y0 / (y0 - y1); tot += y0 > 0 ? y0 / 2 * (xc - x0) : y1 / 2 * (x1 - xc); }
  }
  return tot * signo;
}

function interp(s: number[], eta: number[], x: number): number {
  const n = s.length;
  if (x < s[0] - 1e-9 || x > s[n - 1] + 1e-9) return 0;
  let k = 0; while (k < n - 2 && x > s[k + 1]) k++;
  const t = s[k + 1] > s[k] ? (x - s[k]) / (s[k + 1] - s[k]) : 0;
  return eta[k] + (eta[k + 1] - eta[k]) * Math.min(1, Math.max(0, t));
}

/** Máximo y mínimo de UNA línea de influencia bajo un vehículo (método Exact de CSI). */
export function extremoVehiculo(s: number[], eta: number[], V: VehiculoGeneral, negOk = false, sInt: number[] = s): [number, number] {
  const n = V.ejes.length, Lc = s[s.length - 1];
  const seps: number[][] = [V.sep.slice()];
  if (V.variable) {
    const { k, dmax } = V.variable, cand = new Set<number>([V.sep[k], dmax > 0 ? dmax : V.sep[k]]);
    for (let a = 0; a < s.length; a++) for (let b = 0; b < s.length; b++) { const d = Math.abs(s[b] - s[a]); if (d >= V.sep[k] - 1e-9 && (dmax <= 0 || d <= dmax + 1e-9)) cand.add(d); }
    for (const d of cand) { const q = V.sep.slice(); q[k] = d; seps.push(q); }
  }
  const unif = V.unif ?? [];
  let mx = 0, mn = 0;
  for (const sep of seps) {
    const off = [0]; for (let j = 1; j < n; j++) off.push(off[j - 1] + sep[j - 1]);
    for (const dir of [1, -1]) for (let j = 0; j < n; j++) for (const sk of s) {
      const front = sk + dir * off[j];                            // el eje j en el punto sk
      const xs = off.map((o) => front - dir * o);
      let ma = 0, mi = 0;
      xs.forEach((x, q) => {
        const r = V.ejes[q] * interp(s, eta, x);
        if (negOk) { ma += r; mi += r; } else { if (r > 0) ma += r; else mi += r; }
      });
      // uniformes: delantera (por delante del eje 1, infinita), entre ejes, trasera (detrás del último, infinita)
      const tramo = (k: number): [number, number] => {
        const a = k === 0 ? xs[0] : xs[k - 1], b = k === 0 ? (dir > 0 ? Infinity : -Infinity) : k === n ? (dir > 0 ? -Infinity : Infinity) : xs[k];
        const lo = Math.max(0, Math.min(a, b)), hi = Math.min(Lc, Math.max(a, b));
        return [lo, hi];
      };
      for (let k = 0; k <= n; k++) {
        const w = unif[k] ?? 0; if (!w) continue;
        const [lo, hi] = tramo(k);
        if (negOk) { const v = w * (integralSigno(sInt, eta, lo, hi, 1) + integralSigno(sInt, eta, lo, hi, -1)); ma += v; mi += v; }
        else { ma += w * integralSigno(sInt, eta, lo, hi, 1); mi += w * integralSigno(sInt, eta, lo, hi, -1); }
      }
      if (ma > mx) mx = ma; if (mi < mn) mn = mi;
    }
  }
  return [mx, mn];
}

/** Puntos de carga del carril: paso uniforme, el mayor que no pase de `disc` (p. 494). */
export function puntosDeCarga(Lc: number, disc: number): number[] {
  const n = Math.max(1, Math.ceil(Lc / disc - 1e-9));
  return Array.from({ length: n + 1 }, (_, k) => (k * Lc) / n);
}

/** MOVING LOAD: envolvente (máx, mín) de desplazamientos, reacciones y fuerzas de barra (extremos) de varios vehículos
 *  (la clase de vehículos: manda el peor) en un carril. sf = factor de escala del caso. */
export function cargaMovilEnvolvente(nodes: Node[], elements: Element[], nodeInputs: NodeInputs, elementInputs: ElementInputs,
  carril: Carril, vehiculos: VehiculoGeneral[], op: { disc?: number; sf?: number; negOk?: boolean; epsNudo?: number; tolInfl?: number } = {},
  springs?: Array<{ node: number; dof: number; k: number }>): EnvolventeMovil {
  const tr = tramosCarril(nodes, elements, carril), Lc = largoCarril(tr);
  const s0 = puntosDeCarga(Lc, op.disc ?? Math.min(...tr.map((t) => t.L)));
  // s = donde cae DE VERDAD cada punto de carga (con epsNudo, el del nudo interior queda a (1 − ε)·L): la línea de
  // influencia se interpola entre esas abscisas (medido en SAP2000: «Lane Centerline Points» 0.999 / 1.001 …)
  const s: number[] = [];
  const pasos = s0.map((x) => { const p = pasoVacio(); s.push(cargarEnCarril(p, nodes, elements, elementInputs, tr, x, 1, [0, 0, -1], 1e-6, op.epsNudo ?? 0.001)); return p; });
  const R = multiStepStatic(nodes, elements, { ...nodeInputs, loads: new Map() } as NodeInputs,
    { ...elementInputs, frameFixedEnd: undefined, frameLoads: undefined } as ElementInputs, [{ pasos, sf: 1 }], springs);
  const sf = op.sf ?? 1;
  const ext = (eta0: number[]): [number, number] => {
    let mx = 0, mn = 0;
    const tolI = (op.tolInfl ?? 0) * Math.max(0, ...eta0.map(Math.abs));
    const eta = tolI > 0 ? eta0.map((v) => (Math.abs(v) < tolI ? 0 : v)) : eta0;
    for (const V of vehiculos) { const [a, b] = extremoVehiculo(s, eta, V, op.negOk, s); mx = Math.max(mx, a); mn = Math.min(mn, b); }
    return sf >= 0 ? [mx * sf, mn * sf] : [mn * sf, mx * sf];
  };
  const out: EnvolventeMovil = { disp: new Map(), reac: new Map(), barras: new Map(), puntos: s };
  for (let q = 0; q < nodes.length; q++) {
    const mx: number[] = [], mn: number[] = [];
    for (let g = 0; g < 6; g++) { const [a, b] = ext(R.map((r) => r.deformations.get(q)?.[g] ?? 0)); mx.push(a); mn.push(b); }
    out.disp.set(q, [mx, mn]);
  }
  for (const q of R[0].reactions.keys()) {
    const mx: number[] = [], mn: number[] = [];
    for (let g = 0; g < 6; g++) { const [a, b] = ext(R.map((r) => r.reactions.get(q)?.[g] ?? 0)); mx.push(a); mn.push(b); }
    out.reac.set(q, [mx, mn]);
  }
  const campos = ["normals", "shearsY", "shearsZ", "torsions", "bendingsY", "bendingsZ"] as const;
  elements.forEach((e, k) => {
    if (e.length !== 2) return;
    const ends: Array<[number[], number[]]> = [];
    for (const extremo of [0, 1]) {
      const mx: number[] = [], mn: number[] = [];
      campos.forEach((c, ci) => {
        // diagrama CSI: en i = −f, en j = +f; M2 con el signo cambiado
        const sg = (extremo === 0 ? -1 : 1) * (ci === 4 ? -1 : 1);
        const [a, b] = ext(R.map((r) => sg * ((r as any)[c].get(k)?.[extremo] ?? 0)));
        mx.push(a); mn.push(b);
      });
      ends.push([mx, mn]);
    }
    out.barras.set(k, ends);
  });
  return out;
}
