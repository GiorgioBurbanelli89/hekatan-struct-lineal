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

export function cargasEnCM(nodes: number[][], pisos: Piso[], F: number[], dir: 0 | 1, eccIn: number | number[],
  masas: number[][], diaphragms?: Map<number, number>): Map<number, Carga6> {
  const L = new Map<number, Carga6>();
  const suma = (n: number, c: number, v: number) => {
    if (!L.has(n)) L.set(n, [0, 0, 0, 0, 0, 0]); L.get(n)![c] += v;
  };
  pisos.forEach((p, i) => {
    for (const n of p.nudos) suma(n, dir, F[i] * masas[n][0] / p.masa);
    const ecc = Array.isArray(eccIn) ? eccIn[i] ?? 0 : eccIn;   // por piso: el Ax del borrador amplifica cada nivel
    if (ecc) {
      // dimensión perpendicular al sismo (sismo en X → la del edificio en Y)
      const c = dir === 0 ? 1 : 0, v = p.nudos.map((n) => nodes[n][c]);
      const B = Math.max(...v) - Math.min(...v);
      // sismo en X con el CM corrido +e en Y: Mz = −Fx·e; sismo en Y corrido +e en X: Mz = +Fy·e
      const Mz = (dir === 0 ? -1 : 1) * F[i] * ecc * B;
      const maestro = p.nudos.find((n) => diaphragms?.has(n));
      if (maestro !== undefined) suma(maestro, 5, Mz);
      else {
        // SIN diafragma (losa de cáscara, 1-oct-2026): un momento Rz en UN nudo solo hace girar ese nudo y la planta
        // casi no se entera (la torsión accidental salía subestimada). Va como PAR de fuerzas repartido por la masa:
        // F_i = Mz·m_i·(−y_i, x_i)/J respecto al CM, J = Σ m_i·r_i² (misma resultante nula y mismo momento Mz).
        const J = p.nudos.reduce((a, n) => a + masas[n][0] * ((nodes[n][0] - p.cm[0]) ** 2 + (nodes[n][1] - p.cm[1]) ** 2), 0);
        if (J > 0) for (const n of p.nudos) {
          const w = (Mz * masas[n][0]) / J;
          suma(n, 0, -w * (nodes[n][1] - p.cm[1])); suma(n, 1, w * (nodes[n][0] - p.cm[0]));
        }
      }
    }
  });
  return L;
}

export type DerivaPiso = { k: number; h: number; max: number; min: number; prom: number; relacion: number;
  inelastica: number; torsional: boolean; nudoMax: number; relDesp: number;
  /** desplazamiento del nivel: máximo y PROMEDIO de los extremos (umax+umin)/2, como «Story Max Over Avg Displacements» de ETABS */
  umax: number; uprom: number };

/** Derivas de los ejes de columna (nudos del piso con otro en la misma planta abajo, o la base).
 *  amp = factor de la deriva inelástica: NEC-15 0.75·R (§6.3.9), borrador Cd/Ie (ec. 6.8). relDesp = δmax/δprom de los
 *  DESPLAZAMIENTOS del nivel (para el Ax del borrador, ec. 6.7). */
export function derivas(nodes: number[][], pisos: Piso[], U: Map<number, number[]>, dir: 0 | 1, amp: number,
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
    let max = -Infinity, min = Infinity, nudoMax = -1, umax = -Infinity, umin = Infinity;
    arriba.forEach((n, c) => {
      const b = abajo.get(c); if (b === undefined) return;
      const d = Math.abs(((U.get(n)?.[dir] ?? 0) - (U.get(b)?.[dir] ?? 0)) / h);
      if (d > max) { max = d; nudoMax = n; } if (d < min) min = d;
      const u = Math.abs(U.get(n)?.[dir] ?? 0); if (u > umax) umax = u; if (u < umin) umin = u;
    });
    const prom = (max + min) / 2;
    return { k: p.k, h, max, min, prom, relacion: max / prom, inelastica: amp * max, torsional: max > 1.2 * prom, nudoMax,
      relDesp: umax / ((umax + umin) / 2), umax, uprom: (umax + umin) / 2 };
  });
}

/**
 * Centro de RIGIDEZ por piso, como ETABS («Centers of Mass and Rigidity»): cargas UNITARIAS aplicadas SOLO en el
 * diafragma de ese piso (Fx, Fy y Mz en un nudo n del diafragma) y el giro θ del diafragma en cada caso. Una fuerza
 * que pasa por el CR no gira el piso:  xCR = x_n − θ(Fy)/θ(Mz),  yCR = y_n + θ(Fx)/θ(Mz).
 */
export function centrosDeRigidez(nodes: number[][], pisos: Piso[], diaphragms: Map<number, number>,
  resolver: (loads: Map<number, Carga6>) => Map<number, number[]>): [number, number][] {
  if (!diaphragms.size) return centrosDeRigidezSinDiafragma(nodes, pisos, resolver);
  return pisos.map((p) => {
    const n = p.nudos.find((q) => diaphragms.has(q)) ?? p.nudos[0];
    const giro = (c: number) => { const L = new Map<number, Carga6>(); const v: Carga6 = [0, 0, 0, 0, 0, 0]; v[c] = 1; L.set(n, v); return resolver(L).get(n)![5]; };
    const tFx = giro(0), tFy = giro(1), tMz = giro(5);
    return [nodes[n][0] - tFy / tMz, nodes[n][1] + tFx / tMz] as [number, number];
  });
}

/**
 * CR sin diafragma rígido (losa de cáscara, 1-oct-2026). Con una carga en UN nudo, su rz es el giro local de ese
 * nudo, no el del piso. Aquí Fx, Fy y Mz unitarios se reparten en todos los nudos del piso (por igual; el Mz como
 * par F_i = (−y_i, x_i)/Σr² respecto al centroide) y el giro del piso es el de mínimos cuadrados
 * θ = Σ(x_i·u_y − y_i·u_x)/Σr². Misma lectura que con diafragma: xCR = x_c − θ(Fy)/θ(Mz), yCR = y_c + θ(Fx)/θ(Mz).
 */
function centrosDeRigidezSinDiafragma(nodes: number[][], pisos: Piso[],
  resolver: (loads: Map<number, Carga6>) => Map<number, number[]>): [number, number][] {
  return pisos.map((p) => {
    const ns = p.nudos.filter((q) => Math.abs(nodes[q][2] - p.z) < 1e-3);
    const xc = ns.reduce((s, q) => s + nodes[q][0], 0) / ns.length, yc = ns.reduce((s, q) => s + nodes[q][1], 0) / ns.length;
    const r = ns.map((q) => [nodes[q][0] - xc, nodes[q][1] - yc]), r2 = r.reduce((s, v) => s + v[0] ** 2 + v[1] ** 2, 0);
    const giro = (c: number) => {
      const L = new Map<number, Carga6>();
      ns.forEach((q, k) => L.set(q, (c === 0 ? [1 / ns.length, 0, 0, 0, 0, 0] : c === 1 ? [0, 1 / ns.length, 0, 0, 0, 0]
        : [-r[k][1] / r2, r[k][0] / r2, 0, 0, 0, 0]) as Carga6));
      const U = resolver(L);
      return ns.reduce((s, q, k) => { const u = U.get(q) ?? [0, 0]; return s + r[k][0] * u[1] - r[k][1] * u[0]; }, 0) / r2;
    };
    const tFx = giro(0), tFy = giro(1), tMz = giro(5);
    return [xc - tFy / tMz, yc + tFx / tMz] as [number, number];
  });
}
