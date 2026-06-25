/**
 * 🎓 Vista de reporte estilo Aguiar Falconí: condensa la matriz COMPLETA del FEM a la
 * matriz de rigidez en COORDENADAS DE PISO K_E (3 GDL/piso: u_x, u_y, θ) y expone los 9
 * bloques con nombre (ec. 3.6 de Aguiar) para LEER la torsión:
 *
 *        ┌ K_xx  K_xy  K_xθ ┐
 *   K_E =│ K_xy  K_yy  K_yθ │   K_θθ = rigidez torsional ; K_xθ,K_yθ = acoplamiento (torsión)
 *        └ K_xθ  K_yθ  K_θθ ┘
 *
 * NO cambia el análisis (Hekatan resuelve la K completa); es SOLO una vista para reportar la
 * torsión "a lo Aguiar". Método: por cada piso con diafragma rígido, se aplican cargas
 * unitarias Fx, Fy, Mz al maestro y se mide [u_x,u_y,θ] → matriz de flexibilidad F (3×3) →
 * K_E = F⁻¹ (condensación estática expresada como inversa de la flexibilidad del piso).
 */

export interface FloorKE {
  Kxx: number; Kyy: number; Ktt: number;
  Kxy: number; Kxt: number; Kyt: number;
  /** Matriz 3×3 [[Kxx,Kxy,Kxt],[Kxy,Kyy,Kyt],[Kxt,Kyt,Ktt]] */
  KE: number[][];
  /** Centro de rigidez (de los acoplamientos): xCR = Kyθ/Kyy, yCR = -Kxθ/Kxx */
  cr: { x: number; y: number };
  /** ¿Hay acoplamiento de torsión? (|Kxθ| o |Kyθ| no despreciables vs Kθθ) */
  tieneTorsion: boolean;
}

/** Invierte una matriz 3×3. */
function inv3(m: number[][]): number[][] {
  const [a, b, c] = m[0], [d, e, f] = m[1], [g, h, i] = m[2];
  const A = e * i - f * h, B = -(d * i - f * g), C = d * h - e * g;
  const det = a * A + b * B + c * C;
  if (Math.abs(det) < 1e-30) return [[0, 0, 0], [0, 0, 0], [0, 0, 0]];
  const D = -(b * i - c * h), E = a * i - c * g, F = -(a * h - b * g);
  const Gg = b * f - c * e, H = -(a * f - c * d), I = a * e - b * d;
  return [[A / det, D / det, Gg / det], [B / det, E / det, H / det], [C / det, F / det, I / det]];
}

/**
 * Recupera K_E (coordenadas de piso) de un piso por condensación, con cargas unitarias.
 * @param solveMaster  aplica un vector de carga [Fx,Fy,Mz] en el maestro del diafragma,
 *   resuelve el FEM y devuelve [u_x, u_y, θ] del maestro. El ejemplo lo conecta a deform().
 * @param tol  umbral relativo para marcar torsión (default 1%).
 */
export function recuperarRigidezPiso(
  solveMaster: (load: [number, number, number]) => [number, number, number],
  tol = 0.01,
): FloorKE {
  // flexibilidad F: columnas = respuesta del maestro a cargas unitarias
  const cx = solveMaster([1, 0, 0]);   // [ux,uy,θ] por Fx=1
  const cy = solveMaster([0, 1, 0]);   // por Fy=1
  const ct = solveMaster([0, 0, 1]);   // por Mz=1
  const F = [
    [cx[0], cy[0], ct[0]],
    [cx[1], cy[1], ct[1]],
    [cx[2], cy[2], ct[2]],
  ];
  const KE = inv3(F);
  const Kxx = KE[0][0], Kyy = KE[1][1], Ktt = KE[2][2];
  const Kxy = KE[0][1], Kxt = KE[0][2], Kyt = KE[1][2];
  const cr = { x: Math.abs(Kyy) > 1e-30 ? Kyt / Kyy : 0, y: Math.abs(Kxx) > 1e-30 ? -Kxt / Kxx : 0 };
  const escala = Math.sqrt(Math.abs(Kxx * Ktt)) + Math.sqrt(Math.abs(Kyy * Ktt)) + 1e-30;
  const tieneTorsion = (Math.abs(Kxt) + Math.abs(Kyt)) / escala > tol;
  return { Kxx, Kyy, Ktt, Kxy, Kxt, Kyt, KE, cr, tieneTorsion };
}

/** Formatea K_E como texto/HTML para el reporte (estilo ec. 3.6). */
export function formatKE(r: FloorKE, force = "tonf", len = "m"): string {
  const f = (v: number) => v.toExponential(3);
  return [
    `K_E [${force}, ${force}·${len}/rad]:`,
    `  ┌ ${f(r.Kxx)}  ${f(r.Kxy)}  ${f(r.Kxt)} ┐   (u_x)`,
    `  │ ${f(r.Kxy)}  ${f(r.Kyy)}  ${f(r.Kyt)} │   (u_y)`,
    `  └ ${f(r.Kxt)}  ${f(r.Kyt)}  ${f(r.Ktt)} ┘   (θ)`,
    `  K_θθ (torsional) = ${f(r.Ktt)}`,
    `  K_xθ = ${f(r.Kxt)}   K_yθ = ${f(r.Kyt)}   → ${r.tieneTorsion ? "HAY torsión (acoplamiento ≠ 0)" : "sin torsión (simétrico)"}`,
    `  CR = (${r.cr.x.toFixed(3)}, ${r.cr.y.toFixed(3)}) ${len}`,
  ].join("\n");
}
