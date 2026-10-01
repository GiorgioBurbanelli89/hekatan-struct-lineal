/**
 * CAPA NEC — matriz de rigidez en COORDENADAS DE PISO (Aguiar), 1-oct-2026.
 *
 * Con pórticos planos, Aguiar arma K_E = Σ Aᵀ·K_L·A, con A = [cos α  sen α  r]: 3 GDL por piso (u_x, u_y, θ).
 * Con losas y muros de CÁSCARA no hay pórticos planos que sumar, así que K_E sale por CONDENSACIÓN del modelo completo:
 *   1. en el CM de cada piso, Fx = 1, Fy = 1 y Mz = 1, repartidas por la masa de cada nudo (Mz como par m_i·(−y_i, x_i)/J);
 *   2. se resuelve el modelo entero (deform: los mismos apoyos, diafragmas y muelles);
 *   3. u_x, u_y y θ de cada piso = promedios pesados por la masa (θ = Σ m_i·(x_i·u_y − y_i·u_x)/J);
 *   4. las columnas forman la flexibilidad F (3n × 3n) y K_E = F⁻¹.
 * Comprobación: los periodos de K_E·φ = ω²·M·φ, M = diag(m, m, J), con los del modal completo (dual del artículo:
 * 0.4823 / 0.4317 s contra 0.4826 / 0.4318 s; validation/articulo-revista/torsion_aguiar.{mjs,py}).
 * Lectura de la torsión, por piso: e_x = −K_xθ/K_xx, e_y = K_yθ/K_yy (distancia CM → CR) y ρ = |K_yθ|/√(K_yy·K_θθ),
 * 0 = sin acoplamiento lateral-torsión, cerca de 1 = torsión fuerte.
 */
import { deform } from "hekatan-fem";
import type { Piso } from "./pisos";

export type PisoAguiar = { k: number; Kxx: number; Kyy: number; Ktt: number; Kxt: number; Kyt: number; Kxy: number; ex: number; ey: number; rhoX: number; rhoY: number };
export type ResultadoAguiar = { KE: number[][]; T: number[]; part: number[][]; pisos: PisoAguiar[] };

export function matrizDePiso(nodes: number[][], elements: number[][], nodeInputs: any, elementInputs: any,
  pisos: Piso[], masas: number[][]): ResultadoAguiar {
  const n = pisos.length;
  const fl = pisos.map((p) => {
    const m = p.nudos.map((i) => masas[i][0]), M = m.reduce((a, b) => a + b, 0);
    const rel = p.nudos.map((i) => [nodes[i][0] - p.cm[0], nodes[i][1] - p.cm[1]]);
    const J = p.nudos.reduce((a, _, k) => a + m[k] * (rel[k][0] ** 2 + rel[k][1] ** 2), 0);
    return { ns: p.nudos, m, M, rel, J };
  });
  const F = Array.from({ length: 3 * n }, () => new Array(3 * n).fill(0));
  for (let j = 0; j < n; j++) for (let g = 0; g < 3; g++) {
    const f = fl[j], loads = new Map<number, number[]>();
    f.ns.forEach((i, k) => {
      const c = [0, 0, 0, 0, 0, 0], w = f.m[k];
      if (g === 0) c[0] = w / f.M; else if (g === 1) c[1] = w / f.M;
      else { c[0] = (-w * f.rel[k][1]) / f.J; c[1] = (w * f.rel[k][0]) / f.J; }
      loads.set(i, c);
    });
    const U = deform(nodes as any, elements as any, { ...nodeInputs, loads } as any, elementInputs).deformations as Map<number, number[]>;
    fl.forEach((f2, i2) => {
      let ux = 0, uy = 0, th = 0;
      f2.ns.forEach((i, k) => {
        const u = U?.get(i) ?? [0, 0];
        ux += (f2.m[k] * u[0]) / f2.M; uy += (f2.m[k] * u[1]) / f2.M;
        th += (f2.m[k] * (f2.rel[k][0] * u[1] - f2.rel[k][1] * u[0])) / f2.J;
      });
      F[3 * i2][3 * j + g] = ux; F[3 * i2 + 1][3 * j + g] = uy; F[3 * i2 + 2][3 * j + g] = th;
    });
  }
  for (let a = 0; a < 3 * n; a++) for (let b = a + 1; b < 3 * n; b++) { const s = (F[a][b] + F[b][a]) / 2; F[a][b] = F[b][a] = s; }  // Maxwell-Betti
  const KE = inversa(F);
  // modos del modelo reducido: M^-1/2·K·M^-1/2 (M diagonal) → Jacobi
  const Md = fl.flatMap((f) => [f.M, f.M, f.J]), s = Md.map((v) => 1 / Math.sqrt(v));
  const A = KE.map((fila, a) => fila.map((v, b) => v * s[a] * s[b]));
  const { val, vec } = jacobi(A);
  const orden = val.map((v, k) => k).sort((a, b) => val[a] - val[b]);
  const T = orden.map((k) => (2 * Math.PI) / Math.sqrt(Math.max(val[k], 1e-30)));
  const part = orden.map((k) => {
    const e = [0, 0, 0];
    for (let a = 0; a < 3 * n; a++) e[a % 3] += vec[a][k] ** 2;              // φ = M^-1/2·v → energía m·φ² = v²
    const t = e[0] + e[1] + e[2]; return e.map((x) => x / t);
  });
  const pisosA = pisos.map((p, k) => {
    const B = (a: number, b: number) => KE[3 * k + a][3 * k + b];
    return { k: p.k, Kxx: B(0, 0), Kyy: B(1, 1), Ktt: B(2, 2), Kxt: B(0, 2), Kyt: B(1, 2), Kxy: B(0, 1),
      ex: -B(0, 2) / B(0, 0), ey: B(1, 2) / B(1, 1),
      rhoX: Math.abs(B(0, 2)) / Math.sqrt(B(0, 0) * B(2, 2)), rhoY: Math.abs(B(1, 2)) / Math.sqrt(B(1, 1) * B(2, 2)) };
  });
  return { KE, T, part, pisos: pisosA };
}

function inversa(M: number[][]): number[][] {
  const n = M.length, A = M.map((f, i) => [...f, ...Array.from({ length: n }, (_, j) => (i === j ? 1 : 0))]);
  for (let c = 0; c < n; c++) {
    let p = c; for (let r = c + 1; r < n; r++) if (Math.abs(A[r][c]) > Math.abs(A[p][c])) p = r;
    [A[c], A[p]] = [A[p], A[c]];
    const d = A[c][c]; for (let j = 0; j < 2 * n; j++) A[c][j] /= d;
    for (let r = 0; r < n; r++) if (r !== c) { const f = A[r][c]; if (f) for (let j = 0; j < 2 * n; j++) A[r][j] -= f * A[c][j]; }
  }
  return A.map((f) => f.slice(n));
}

/** autovalores de una simétrica por Jacobi cíclico (n ≤ ~150: aquí 3 por piso) */
function jacobi(S: number[][]): { val: number[]; vec: number[][] } {
  const n = S.length, A = S.map((f) => [...f]), V = A.map((_, i) => A.map((__, j) => (i === j ? 1 : 0)));
  for (let barrido = 0; barrido < 100; barrido++) {
    let off = 0; for (let i = 0; i < n; i++) for (let j = i + 1; j < n; j++) off += A[i][j] ** 2;
    let dia = 0; for (let i = 0; i < n; i++) dia += A[i][i] ** 2;
    if (off <= 1e-26 * dia) break;
    for (let p = 0; p < n; p++) for (let q = p + 1; q < n; q++) {
      if (Math.abs(A[p][q]) < 1e-300) continue;
      const th = (A[q][q] - A[p][p]) / (2 * A[p][q]), t = Math.sign(th || 1) / (Math.abs(th) + Math.sqrt(th * th + 1));
      const c = 1 / Math.sqrt(t * t + 1), s = t * c;
      for (let k = 0; k < n; k++) { const a = A[k][p], b = A[k][q]; A[k][p] = c * a - s * b; A[k][q] = s * a + c * b; }
      for (let k = 0; k < n; k++) { const a = A[p][k], b = A[q][k]; A[p][k] = c * a - s * b; A[q][k] = s * a + c * b; }
      for (let k = 0; k < n; k++) { const a = V[k][p], b = V[k][q]; V[k][p] = c * a - s * b; V[k][q] = s * a + c * b; }
    }
  }
  return { val: A.map((f, i) => f[i]), vec: V };
}
