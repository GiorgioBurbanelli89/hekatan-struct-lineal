/**
 * CAPA NEC — 3: cargas del estático en el CM (con excentricidad accidental) y derivas por piso (30-sep-2026).
 *
 * NEC-SE-DS 2015 §6.3.7: la fuerza de cada piso va en su centro de masa desplazado ±5 % de la dimensión
 * del edificio perpendicular a la dirección del sismo (momento torsor accidental Mt = F·e).
 * §5.2 / Tabla 13 (irregularidad torsional, tipo 1): Δmáx > 1.2·(Δ1 + Δ2)/2, con Δ1 Δ2 las derivas de
 * los extremos del piso en la dirección del sismo. Deriva inelástica §6.3.9: ΔM = 0.75·R·ΔE ≤ 0.02 (H.A.).
 *
 * La fuerza del piso se reparte entre sus nudos proporcional a su masa: la resultante cae EXACTA en el CM
 * (el CM es la media de las posiciones pesada con la misma masa). El torsor va como momento Rz en un nudo
 * del diafragma del piso (el diafragma rígido lo reparte). SAP2000 recibe esas mismas cargas nodales.
 */
import type { Piso } from "./pisos";

export type Carga6 = [number, number, number, number, number, number];

export function cargasEnCM(nodes: number[][], pisos: Piso[], F: number[], dir: 0 | 1, ecc: number,
  masas: number[][], diaphragms?: Map<number, number>): Map<number, Carga6> {
  const L = new Map<number, Carga6>();
  const suma = (n: number, c: number, v: number) => {
    if (!L.has(n)) L.set(n, [0, 0, 0, 0, 0, 0]); L.get(n)![c] += v;
  };
  pisos.forEach((p, i) => {
    for (const n of p.nudos) suma(n, dir, F[i] * masas[n][0] / p.masa);
    if (ecc) {
      // dimensión perpendicular al sismo (sismo en X → la del edificio en Y)
      const c = dir === 0 ? 1 : 0, v = p.nudos.map((n) => nodes[n][c]);
      const B = Math.max(...v) - Math.min(...v);
      // sismo en X con el CM corrido +e en Y: Mz = −Fx·e; sismo en Y corrido +e en X: Mz = +Fy·e
      const Mz = (dir === 0 ? -1 : 1) * F[i] * ecc * B;
      const maestro = p.nudos.find((n) => diaphragms?.has(n)) ?? p.nudos[0];
      suma(maestro, 5, Mz);
    }
  });
  return L;
}

export type DerivaPiso = { k: number; h: number; max: number; min: number; prom: number; relacion: number;
  inelastica: number; torsional: boolean; nudoMax: number };

/** Derivas de los ejes de columna (nudos del piso con otro en la misma planta abajo, o la base). */
export function derivas(nodes: number[][], pisos: Piso[], U: Map<number, number[]>, dir: 0 | 1, R: number,
  soloNudos?: (n: number) => boolean): DerivaPiso[] {
  const clave = (p: number[]) => `${p[0].toFixed(3)},${p[1].toFixed(3)}`;
  const zs = [0, ...pisos.map((p) => p.z)];
  const porNivel = zs.map((z) => {
    const m = new Map<string, number>();
    nodes.forEach((p, n) => { if (Math.abs(p[2] - z) < 1e-3 && (!soloNudos || z < 1e-6 || soloNudos(n))) m.set(clave(p), n); });
    return m;
  });
  return pisos.map((p, i) => {
    const h = zs[i + 1] - zs[i], arriba = porNivel[i + 1], abajo = porNivel[i];
    let max = -Infinity, min = Infinity, nudoMax = -1;
    arriba.forEach((n, c) => {
      const b = abajo.get(c); if (b === undefined) return;
      const d = Math.abs(((U.get(n)?.[dir] ?? 0) - (U.get(b)?.[dir] ?? 0)) / h);
      if (d > max) { max = d; nudoMax = n; } if (d < min) min = d;
    });
    const prom = (max + min) / 2;
    return { k: p.k, h, max, min, prom, relacion: max / prom, inelastica: 0.75 * R * max, torsional: max > 1.2 * prom, nudoMax };
  });
}

/**
 * Centro de RIGIDEZ por piso, como ETABS («Centers of Mass and Rigidity»): cargas UNITARIAS aplicadas SOLO en el
 * diafragma de ese piso (Fx, Fy y Mz en un nudo n del diafragma) y el giro θ del diafragma en cada caso. Una fuerza
 * que pasa por el CR no gira el piso:  xCR = x_n − θ(Fy)/θ(Mz),  yCR = y_n + θ(Fx)/θ(Mz).
 */
export function centrosDeRigidez(nodes: number[][], pisos: Piso[], diaphragms: Map<number, number>,
  resolver: (loads: Map<number, Carga6>) => Map<number, number[]>): [number, number][] {
  return pisos.map((p) => {
    const n = p.nudos.find((q) => diaphragms.has(q)) ?? p.nudos[0];
    const giro = (c: number) => { const L = new Map<number, Carga6>(); const v: Carga6 = [0, 0, 0, 0, 0, 0]; v[c] = 1; L.set(n, v); return resolver(L).get(n)![5]; };
    const tFx = giro(0), tFy = giro(1), tMz = giro(5);
    return [nodes[n][0] - tFy / tMz, nodes[n][1] + tFx / tMz] as [number, number];
  });
}
